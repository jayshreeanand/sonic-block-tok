# BlockTok Dependencies Installation Guide

This guide will help you install all the necessary dependencies for the BlockTok project.

## Fixing Node.js Issues

If you're seeing an error like:

```
dyld: Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.67.dylib
Referenced from: /usr/local/bin/node
Reason: image not found
```

You need to fix your Node.js installation. Here are some possible solutions:

1. Reinstall Node.js:

   ```bash
   brew uninstall node
   brew install node
   ```

2. Reinstall the icu4c package:

   ```bash
   brew uninstall --ignore-dependencies icu4c
   brew install icu4c
   ```

3. Or try using nvm (Node Version Manager):

   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

   # Install and use a specific Node.js version
   nvm install 18
   nvm use 18
   ```

## Required Dependencies

Once your Node.js installation is fixed, install the following dependency groups:

### 1. UI Component Libraries

```bash
npm install --legacy-peer-deps @radix-ui/react-slot @radix-ui/react-label class-variance-authority clsx tailwind-merge sonner lucide-react tailwindcss-animate
```

### 2. Solana Blockchain Dependencies

```bash
npm install --legacy-peer-deps @coral-xyz/anchor @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/spl-token
```

### 3. Theme and UI Framework

```bash
npm install --legacy-peer-deps next-themes
```

## Why We're Using --legacy-peer-deps

We're using the `--legacy-peer-deps` flag because some of our dependencies have peer dependencies that are incompatible with the latest React version (React 19). This flag ignores peer dependency conflicts and allows the installation to proceed.

## Verifying Installation

After installing all dependencies, check your package.json to ensure they're all listed:

```bash
cat package.json | grep -A 30 "dependencies"
```

## Running the Project

After installing all dependencies, start the development server:

```bash
npm run dev
```

Your BlockTok application should now be running with all the necessary dependencies for UI components and blockchain integration.
