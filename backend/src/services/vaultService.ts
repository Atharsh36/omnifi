import { ethers } from 'ethers';
import { loadDb, saveDb, VaultRecord } from './vaultDb';

let provider: ethers.JsonRpcProvider;
let blockPollingInterval: NodeJS.Timeout | null = null;
let lastBlock = 0;

function createProvider() {
    return new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
}

provider = createProvider();

export async function getOrCreateVault(userAddress: string): Promise<string> {
    const db = loadDb();
    const lowerAddress = userAddress.toLowerCase();

    if (db[lowerAddress]) {
        return db[lowerAddress].vaultWallet;
    }

    // Create new wallet
    const newWallet = ethers.Wallet.createRandom();
    const encryptedKey = newWallet.privateKey; // In MVP hackathon, storing raw is sometimes ok, but named 'encrypted'

    db[lowerAddress] = {
        userWallet: lowerAddress,
        vaultWallet: newWallet.address,
        encryptedPrivateKey: encryptedKey,
        depositBalance: 0
    };

    saveDb(db);
    return newWallet.address;
}

export function getDepositBalance(userAddress: string): number {
    const db = loadDb();
    const lowerAddress = userAddress.toLowerCase();

    if (db[lowerAddress]) {
        return db[lowerAddress].depositBalance;
    }
    return 0;
}

export function deductBalance(userAddress: string, amount: number): boolean {
    const db = loadDb();
    const lowerAddress = userAddress.toLowerCase();

    if (!db[lowerAddress] || db[lowerAddress].depositBalance < amount) {
        return false; // Insufficient funds
    }

    db[lowerAddress].depositBalance -= amount;
    saveDb(db);
    return true;
}

export function addBalance(userAddress: string, amount: number): boolean {
    const db = loadDb();
    const lowerAddress = userAddress.toLowerCase();

    if (!db[lowerAddress]) {
        return false; // Vault not found
    }

    db[lowerAddress].depositBalance += amount;
    saveDb(db);
    return true;
}

export async function withdrawBalance(userAddress: string, amount: number): Promise<{ success: boolean; hash?: string; error?: string }> {
    const db = loadDb();
    const lowerAddress = userAddress.toLowerCase();

    if (!db[lowerAddress]) return { success: false, error: "Vault not found" };
    if (db[lowerAddress].depositBalance < amount) return { success: false, error: "Insufficient logical balance" };

    try {
        const wallet = new ethers.Wallet(db[lowerAddress].encryptedPrivateKey, provider);
        const amountWei = ethers.parseEther(amount.toString());

        // Verify real on-chain balance to account for gas
        const actualBalance = await provider.getBalance(wallet.address);
        const feeData = await provider.getFeeData();
        const gasLimit = BigInt(21000); // Standard transfer
        const gasPrice = feeData.gasPrice || ethers.parseUnits('10', 'gwei');
        const gasCost = gasLimit * gasPrice;

        let valueToSend = amountWei;

        // If withdrawing max, subtract gas from payload so it doesn't fail
        if (valueToSend + gasCost > actualBalance) {
            valueToSend = actualBalance - gasCost;
            if (valueToSend <= 0) {
                return { success: false, error: "Balance too low to cover network gas fee" };
            }
        }

        const tx = await wallet.sendTransaction({
            to: userAddress, // Back to their primary metamask
            value: valueToSend
        });

        await tx.wait(1); // Wait for inclusion

        // Deduct from internal dashboard
        db[lowerAddress].depositBalance -= amount;
        saveDb(db);

        console.log(`💸 Successful User Withdrawal: ${amount} BNB sent to ${userAddress}. Tx: ${tx.hash}`);
        return { success: true, hash: tx.hash };

    } catch (e: any) {
        console.error("Native withdrawal failed:", e.message);
        return { success: false, error: e.message || "Blockchain transaction failed" };
    }
}

async function pollBlocks() {
    try {
        const currentBlock = await provider.getBlockNumber();
        if (currentBlock > lastBlock) {
            const db = loadDb();
            const vaultAddresses = Object.values(db).map(v => v.vaultWallet);

            if (vaultAddresses.length > 0) {
                for (let bn = lastBlock + 1; bn <= currentBlock; bn++) {
                    const block = await provider.getBlock(bn, true);
                    if (block?.prefetchedTransactions) {
                        for (const tx of block.prefetchedTransactions) {
                            if (tx.to && vaultAddresses.includes(tx.to)) {
                                console.log(`🤑 Deposit Detected in block ${bn}! Tx: ${tx.hash}`);
                                const amountBNB = Number(ethers.formatEther(tx.value));
                                const userKey = Object.keys(db).find(k => db[k].vaultWallet === tx.to);
                                if (userKey) {
                                    db[userKey].depositBalance += amountBNB;
                                    saveDb(db);
                                    console.log(`✅ Credited ${amountBNB} BNB to user ${userKey}`);
                                }
                            }
                        }
                    }
                }
            }
            lastBlock = currentBlock;
        }
    } catch (e: any) {
        if (e.code !== 'ECONNRESET') {
            console.error('Polling error:', e.message);
        }
    }
}

export async function startDepositListener() {
    console.log("🟢 Starting Vault Deposit Listener on BNB Testnet...");
    lastBlock = await provider.getBlockNumber();
    blockPollingInterval = setInterval(pollBlocks, 3000);
}
