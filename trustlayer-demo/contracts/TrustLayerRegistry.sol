// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TrustLayerRegistry
 * @dev Stores off-chain calculated Trust Scores on-chain,
 * making them accessible to other dApps and smart contracts.
 * 
 * Scores can only be updated by authorized nodes in the Decentralized Oracle Network (DON).
 */
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

    /**
     * @dev Adds a new Oracle node to the network.
     * @param _oracle Address of the new Oracle
     */
    function addOracle(address _oracle) external onlyAdmin {
        isOracle[_oracle] = true;
        emit OracleAdded(_oracle);
    }

    /**
     * @dev Removes a malicious or inactive Oracle from the network.
     * @param _oracle Address of the Oracle to remove
     */
    function removeOracle(address _oracle) external onlyAdmin {
        isOracle[_oracle] = false;
        emit OracleRemoved(_oracle);
    }

    /**
     * @dev Records the off-chain calculated trust score on-chain.
     * @param _user The wallet address of the user
     * @param _score The calculated trust score (0-100)
     */
    function updateTrustScore(address _user, uint8 _score) external onlyOracle {
        require(_score <= 100, "TrustLayer: Score cannot exceed 100.");
        
        trustScores[_user] = _score;
        lastUpdated[_user] = block.timestamp;

        emit TrustScoreUpdated(_user, _score, msg.sender, block.timestamp);
    }

    /**
     * @dev Allows other smart contracts and dApps to read a user's trust score.
     * @param _user The wallet address of the user
     * @return score The trust score of the user
     * @return timestamp The last time the score was updated
     */
    function getTrustScore(address _user) external view returns (uint8 score, uint256 timestamp) {
        return (trustScores[_user], lastUpdated[_user]);
    }
}
