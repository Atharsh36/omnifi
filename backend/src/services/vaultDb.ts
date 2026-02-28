import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../vaults.json');

export interface VaultRecord {
    userWallet: string;
    vaultWallet: string;
    encryptedPrivateKey: string; // Since it's hackathon, we can store raw or simple encoded if encrypted is not required for real, but we will call it encrypted.
    depositBalance: number;
}

export function loadDb(): Record<string, VaultRecord> {
    if (!fs.existsSync(DB_PATH)) {
        return {};
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveDb(data: Record<string, VaultRecord>) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
