@echo off
echo ========================================
echo OmniFi - Quick Start Setup
echo ========================================
echo.

echo [1/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [2/3] Installing Contract Dependencies...
cd contracts
call npm install
cd ..

echo.
echo [3/3] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Deploy contracts: cd contracts ^&^& npx hardhat run scripts/deploy.ts --network bnbTestnet
echo 2. Update frontend/lib/contracts.ts with deployed addresses
echo 3. Configure backend/.env with contract addresses
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Visit: http://localhost:3000
echo.
pause
