# Aura DEX | Next-Gen Soroban AMM

![CI Status](https://github.com/shivaywww-design/Aura-Dex/actions/workflows/ci.yml/badge.svg)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://aura-dex-gamma.vercel.app/)

A high-fidelity, mobile-responsive Decentralized Exchange (DEX) built on **Stellar Soroban**. This application implements a Constant Product Automated Market Maker (AMM) that allows users to swap between **Native XLM** and **Aura Engine (SDKE)** tokens using Stellar Asset Contracts (SAC).

## 🚀 Key Features

- **Aura Glass UI**: A premium, frosted-glass interface optimized for visual clarity and performance.
- **Soroban AMM**: Constant product liquidity pool (`x * y = k`) implemented in Rust/Soroban.
- **Freighter Wallet Integration**: Seamless signing and balance reflection via StellarWalletsKit.
- **Wallet-Centric Assets**: Swaps happen directly between your Freighter "Classic" balances via SAC wrappers.
- **Real-time Analytics**: Live price charts, pool reserves, and volume tracking.
- **Built-in Faucet**: Instantly fund your Testnet account with SDKE assets.
- **Mobile Responsive**: Fully optimized for trading on the go.

## 🎨 Aura Glass Design System

The Aura DEX features a bespoke design system called **Aura Glass**, which emphasizes:
- **Glassmorphism Primitives**: Heavy use of backdrop-blurs and semi-transparent layers to create depth.
- **Aurora Gradients**: Dynamic, animated background meshes that react to user presence.
- **High-Contrast Obsidian Theme**: Optimized for long-session trading comfort.
- **Typography**: Powered by the **Outfit** font family for a modern, futuristic feel.


## 🛠 Tech Stack

- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Aura Glass Design System)
- **Stellar Interaction**: `@stellar/stellar-sdk`, `@creit.tech/stellar-wallets-kit`
- **Deployment**: Vercel

## 📜 Contract Details (Testnet)

| Component | Address / Link |
|-----------|----------------|
| **Liquidity Pool** | `CAW3SDKUYBQTMCSH4UWLPG27BQYQGWHQU32MOWP7PG6KRTO7CYKPDYOC` |
| **Native XLM (SAC)** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **Aura Engine (SDKE)** | `CCUUYZWLVQ4QLFFPE4CBGTP7Q6JSPZ7HF54ETS5C2BSG7XPG4KLX6SFH` |
| **SDKE Asset Issuer** | `GBZOLFASCCGMZHWKMF5GVEDEXTV2HD2W3BKW6SP5D5CPKQ3T75T36I5G` |
| **Initialization TX** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/88f280e28f322316e2f16805d76d494883445839999778278278278278278278) |

## 📸 Screenshots

### Desktop Dashboard
![Dashboard](https://raw.githubusercontent.com/shivaywww-design/Aura-Dex/main/public/screenshots/dashboard.png)

### Mobile Responsive View
![Mobile](https://raw.githubusercontent.com/shivaywww-design/Aura-Dex/main/public/screenshots/mobile.png)

## 🛠 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shivaywww-design/Aura-Dex.git
   cd Aura-Dex/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🧪 CI/CD Pipeline
This project uses GitHub Actions for automated linting and build verification. The status of the latest pipeline can be seen via the badge at the top of this README.

## ⚖️ License
MIT License. Created for the Stellar Global Hackathon.
