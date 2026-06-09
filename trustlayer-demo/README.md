# TrustLayer: Hybrid Behavioral Trust Scoring Protocol

![TrustLayer](https://img.shields.io/badge/Status-Active-brightgreen) ![Academic](https://img.shields.io/badge/Context-Academic_Research-blue) ![Authors](https://img.shields.io/badge/Authors-Rana_Ozcan_&_Irem_Kayhan-pink) ![Version](https://img.shields.io/badge/Version-1.0.0-purple) ![Solidity](https://img.shields.io/badge/Solidity-Smart_Contract-363636) ![React Native](https://img.shields.io/badge/Frontend-React_Native_Expo-black)

A hybrid behavioral analysis and trust scoring protocol for EVM-based wallets. TrustLayer evaluates a wallet's risk profile based on its on-chain activity rather than identity checks (KYC), separating heavy computations (off-chain) from the trust registry (on-chain).

This project was built using the Design Science Research Methodology (DSRM) to address limitations like the oracle problem, Sybil resistance, and high on-chain gas costs.

## Why Behavioral Trust Scoring?

Traditional Web3 security relies on identity verification (ZK-KYC, Proof of Humanity). However, verified identity doesn't guarantee safe behavior:
- **Compromised Wallets:** High-reputation accounts can still sign phishing contracts or malicious transactions.
- **Verified Bots:** KYC'd accounts can run MEV/arbitrage bots or execute spam transactions.
- **Sybil Farms:** Verified identities can be sold or outsourced to airdrop farmers.

TrustLayer addresses this by evaluating historical and real-time wallet behavior off-chain, then anchoring the scores on-chain via a decentralized registry.

## Architecture

The system consists of two main parts:

### 1. Off-Chain Behavioral Engine Simulation (React Native / TypeScript)
Computes wallet trust scores (0-100) based on:
- **Transaction Velocity:** Flags bot-like patterns or rapid transactions.
- **Protocol Interaction:** Scores interaction with reputable protocols (e.g., Uniswap, Aave) versus high-risk protocols/mixers.
- **Wallet History:** Checks age, transaction history, and activity patterns.
- **Community Trust Votes:** Applies a small bonus for wallets with peer-verified trust signals.

### 2. On-Chain Registry (`TrustLayerRegistry.sol`)
Stores the off-chain computed trust scores on-chain.
- **Access Control:** The contract uses an `onlyOracle` modifier to ensure that only admin-authorized oracle addresses can update trust scores. In a production scenario, these oracle addresses may represent nodes in a Decentralized Oracle Network (DON).
- **Composability:** Other smart contracts (lending protocols, DEXs) can read the trust scores in real-time or listen to the `TrustScoreUpdated` event.

---

## Smart Contract

The Solidity registry is kept minimal to reduce gas costs.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TrustLayerRegistry {
    
    address public admin;

    mapping(address => bool) public isOracle;

    mapping(address => uint8) private trustScores;
    
    mapping(address => uint256) private lastUpdated;

    event TrustScoreUpdated(address indexed user, uint8 newScore, address indexed oracle, uint256 timestamp);
    event OracleAdded(address indexed oracle);
    event OracleRemoved(address indexed oracle);

    modifier onlyAdmin() {
        require(msg.sender == admin, "TrustLayer: Only admin can perform this action.");
        _;
    }

    modifier onlyOracle() {
        require(isOracle[msg.sender], "TrustLayer: Unauthorized. Only registered Oracles can submit scores.");
        _;
    }

    constructor() {
        admin = msg.sender;
        isOracle[msg.sender] = true; 
    }

    function addOracle(address _oracle) external onlyAdmin {
        isOracle[_oracle] = true;
        emit OracleAdded(_oracle);
    }

    function removeOracle(address _oracle) external onlyAdmin {
        isOracle[_oracle] = false;
        emit OracleRemoved(_oracle);
    }

    function updateTrustScore(address _user, uint8 _score) external onlyOracle {
        require(_score <= 100, "TrustLayer: Score cannot exceed 100.");
        
        trustScores[_user] = _score;
        lastUpdated[_user] = block.timestamp;

        emit TrustScoreUpdated(_user, _score, msg.sender, block.timestamp);
    }

    function getTrustScore(address _user) external view returns (uint8 score, uint256 timestamp) {
        return (trustScores[_user], lastUpdated[_user]);
    }
}
```

---

## Frontend Explorer (Expo / React Native)

The repository includes a dashboard built with React Native (Expo) and TypeScript to explore and test the scoring model.

### Key Sections:
- **Overview:** Displays wallet details, the calculated trust score, and a breakdown of penalties/bonuses (e.g., transaction velocity penalties, age bonuses).
- **Portfolio:** Simulates portfolio balances and highlights interactions with protocols.
- **On-Chain Log:** Displays raw ABI data and event logs that simulate or represent on-chain score updates on an EVM-compatible network.

### Demo Profiles:
We included pre-configured profiles to test the scoring engine:
- **Compromised Whale:** A wallet with long history and high balance that drops to `0` due to sudden interactions with a blacklisted contract.
- **High-Velocity Bot:** A new wallet with high transaction frequency flagged for abnormal velocity.

---

## Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Running the App
1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone https://github.com/ranazcn/trust_layer.git
   cd trustlayer/trustlayer-demo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Expo server:**
   ```bash
   npx expo start
   ```
4. **Open the app:**
   - Press `w` in the terminal to view it in your browser.
   - Or scan the QR code with the Expo Go app on iOS or Android.

---

## Academic Context
This project was designed and developed as an academic prototype for exploring behavioral trust scoring in decentralized environments. It demonstrates how wallet activity can be analyzed off-chain and represented on-chain through a lightweight trust registry.

## Authors

- Rana Özcan
- İrem Kayhan