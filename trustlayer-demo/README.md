# 🛡️ TrustLayer: Hybrid Behavioral Trust Scoring Protocol

![TrustLayer](https://img.shields.io/badge/Status-Active-brightgreen) ![Academic](https://img.shields.io/badge/Context-Academic_Research-blue) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-purple) ![Solidity](https://img.shields.io/badge/Solidity-Smart_Contract-363636) ![React Native](https://img.shields.io/badge/Frontend-React_Native_Expo-black)

## 📖 Abstract
**TrustLayer** is an advanced, hybrid cybersecurity protocol designed for Decentralized Finance (DeFi) ecosystems. It computes a cryptographic trust score (0-100) for Ethereum-based wallets by deeply analyzing **On-Chain Behavior** rather than relying solely on **Identity**. 

Developed utilizing the **Design Science Research Methodology (DSRM)**, this project tackles inherent blockchain limitations—such as "The Oracle Problem," Sybil attacks, and the exorbitant gas costs of on-chain data processing—by splitting the workload between an Off-Chain Behavioral Engine and an On-Chain Decentralized Oracle Network (DON) Registry.

---

## 🔍 The Core Problem: Identity vs. Behavior
In the current Web3 landscape, security heavily revolves around "Identity" (e.g., ZK-KYC, Proof of Humanity). However, in a decentralized world, **a verified human identity does not equate to safe behavior**.

1. **Compromised Wallets:** A highly reputable user can accidentally sign a malicious phishing contract, instantly turning a "trusted" wallet into a threat.
2. **Verified Bots:** A verified human can plug their private keys into a high-frequency MEV (Maximal Extractable Value) or arbitrage bot, acting maliciously despite passing KYC.
3. **Sybil Farms:** Bad actors in developing nations often pass KYC verifications only to sell their private keys to Airdrop farmers or Sybil attackers.

Furthermore, analyzing massive amounts of behavioral data directly on a blockchain is impossible. Smart contracts cannot fetch external data natively (**The Oracle Problem**), and executing complex algorithmic scoring on-chain costs thousands of dollars in Gas fees.

---

## 🏗️ System Architecture & Methodology

To solve these issues, TrustLayer utilizes a **Hybrid Architecture** that ensures zero single points of failure (SPOF) and absolute transparency.

### 1. Off-Chain Behavioral Analysis Engine (React Native / TypeScript)
Heavy computations are shifted off-chain. The system analyzes:
- **Transaction Velocity:** Detects bot-like abnormal activity.
- **Protocol Footprints:** Distinguishes between interacting with "Blue-Chip" protocols (e.g., Aave, Uniswap) vs. Blacklisted protocols (e.g., Tornado Cash Mixers).
- **Wallet Age & Community Approvals:** Weighs the historical significance of the wallet against real-time threats.

### 2. On-Chain Registry via Decentralized Oracle Network (DON)
Once the off-chain engine calculates the score, the result must be written to the blockchain transparently without relying on a single centralized server (which could be hacked or spoofed).
- **Immutable Code, Mutable State:** The `TrustLayerRegistry.sol` smart contract acts as the ultimate source of truth. Its code cannot be altered, but its database (state) is updated via Oracles.
- **The `onlyOracle` Modifier:** TrustLayer employs a Decentralized Oracle Network. Only nodes that are verified in the `isOracle` mapping can push score updates to the blockchain.
- **Smart Contract Composability:** Whenever a score is updated, a `TrustScoreUpdated` event is emitted. Other DeFi protocols (lending protocols, perpetual DEXs) can read these events to decide whether to grant a user credit, under-collateralized loans, or block them entirely.

---

## 💻 Smart Contract Deep Dive

The Solidity contract is purposefully kept lightweight to minimize Gas fees. All heavy lifting is done by the Off-Chain Engine, and the contract simply acts as a secure, decentralized registry.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TrustLayerRegistry {
    // Authorized DON nodes
    mapping(address => bool) public isOracle;
    
    // Core state mappings
    mapping(address => uint8) public trustScores;
    mapping(address => uint256) public lastUpdated;

    // Emitted for cross-dApp composability
    event TrustScoreUpdated(
        address indexed user, 
        uint8 newScore, 
        address indexed oracle, 
        uint256 timestamp
    );

    modifier onlyOracle() {
        require(isOracle[msg.sender], "TrustLayer: Caller is not an authorized Oracle");
        _;
    }

    // Secure state update restricted to DON
    function updateTrustScore(address _user, uint8 _newScore) external onlyOracle {
        require(_newScore <= 100, "TrustLayer: Score cannot exceed 100");
        trustScores[_user] = _newScore;
        lastUpdated[_user] = block.timestamp;
        
        emit TrustScoreUpdated(_user, _newScore, msg.sender, block.timestamp);
    }
}
```

---

## 📱 Frontend Explorer & UX
The frontend application is built with **React Native (Expo)** and **TypeScript**, styled in a modern, data-dense "Cyberpunk / Terminal" aesthetic. 

### Key Application Tabs
1. **OVERVIEW:** Displays the cryptographic Wallet DNA, the final `ALGORITHMIC_SCORE` (0-100), and a detailed mathematical breakdown of how the score was calculated (e.g., Wallet Age Bonus, Abnormal Activity Penalty).
2. **PORTFOLIO:** Highlights the user's `PROTOCOL_INTERACTIONS` (footprints across DeFi) and simulates portfolio balances.
3. **ON-CHAIN:** Exposes the raw ABI data and the exact `ATTESTATION_RECORD` event logs that are pushed to the Ethereum mainnet.

### Edge Case Demo Scenarios
The application includes 100 deterministic dummy profiles to demonstrate the algorithm's capability:
- **The Compromised Whale:** A wallet with a rich, 3-year DeFi history drops to a `0` score instantly due to a detected Phishing or Mixer interaction.
- **The Suspected Bot:** A newly created wallet executing 300+ transactions a day is flagged and penalized for abnormal velocity, bypassing its basic "Identity".

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)

### Installation & Execution
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trustlayer.git
   cd trustlayer/trustlayer-demo
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

4. **View the Application:**
   - Press **`w`** in the terminal to open the web interface (recommended for the full terminal aesthetic).
   - Alternatively, scan the QR code with the **Expo Go** app on your iOS or Android device.

---

## 🎓 Academic Context
This project was designed, architected, and developed as a proof-of-concept for solving behavioral identity crises in decentralized environments without violating the trustless ethos of Web3.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details. Open-source contributions and forks are highly encouraged to push Web3 security research forward.
