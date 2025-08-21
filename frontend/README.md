# Sui NFT Minting App

A React application for minting and managing NFTs on the Sui blockchain.

## Features

- Connect Sui wallet
- Mint NFTs
- View NFT gallery
- Support for multiple networks (devnet, testnet, mainnet)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Deploy:

```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set the following configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `mintNftLesson/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables

In Vercel dashboard, add these environment variables:

**Required:**
- `VITE_SUI_NETWORK`: Choose from `devnet`, `testnet`, or `mainnet`

**Contract Configuration (update with your deployed contract addresses):**
- `VITE_PACKAGE_ID`: Your deployed contract package ID
- `VITE_MINT_ADDRESSES`: Your mint addresses object ID

**Optional:**
- `VITE_SUI_RPC_URL`: Custom RPC URL (if not using default Sui RPC)

### Important Notes

- The app uses Sui's dApp Kit for wallet integration
- Make sure your contract is deployed to the target network
- Update `networkConfig.ts` with your actual contract addresses if needed

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app component
│   ├── WalletStatus.tsx     # Wallet connection status
│   ├── MintNft.tsx          # NFT minting component
│   ├── DisplayNft.tsx       # NFT gallery component
│   ├── networkConfig.ts     # Network configuration
│   └── lib/
│       └── contract.ts      # Contract interaction utilities
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies and scripts
```
