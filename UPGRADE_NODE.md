# How to Upgrade Node.js on Windows

## Option 1: Direct Download (Recommended)

1. Visit https://nodejs.org/
2. Download the **LTS version** (currently 20.x or 18.x)
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal/PowerShell
6. Verify installation:
   ```bash
   node --version
   ```
   Should show v18.17.0 or higher

## Option 2: Using nvm-windows (For managing multiple versions)

1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Open PowerShell as Administrator
4. Run:
   ```bash
   nvm install 18.17.0
   nvm use 18.17.0
   ```
5. Verify:
   ```bash
   node --version
   ```

## After Upgrading

1. Delete `node_modules` folder:
   ```bash
   rm -r node_modules
   ```
2. Delete `package-lock.json`:
   ```bash
   rm package-lock.json
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

