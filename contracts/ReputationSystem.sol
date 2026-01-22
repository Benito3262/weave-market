// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationSystem
 * @notice Manages user reputation and staking on Weave Market
 */
contract ReputationSystem is Ownable {
    
    // Constants
    uint256 public constant BASE_REPUTATION = 1000;
    uint256 public constant MAX_REPUTATION = 10000;
    
    // Structs
    struct ReputationData {
        uint256 reputation;
        uint256 lockedReputation;
        uint256 totalEarned;
        uint256 totalLost;
        uint256 lastUpdated;
    }
    
    // State variables
    mapping(address => ReputationData) public reputations;
    mapping(address => bool) public authorizedContracts;
    
    // Events
    event ReputationInitialized(address indexed user, uint256 reputation);
    event ReputationRewarded(address indexed user, uint256 amount, uint256 newTotal);
    event ReputationPenalized(address indexed user, uint256 amount, uint256 newTotal);
    event ReputationLocked(address indexed user, uint256 amount);
    event ReputationUnlocked(address indexed user, uint256 amount);
    event ContractAuthorized(address indexed contractAddress);
    event ContractRevoked(address indexed contractAddress);
    
    constructor() Ownable(msg.sender) {}
    
    // Modifiers
    modifier onlyAuthorized() {
        require(
            authorizedContracts[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }
    
    /**
     * @notice Initialize reputation for a new user
     * @param user User address
     */
    function initializeReputation(address user) external onlyAuthorized {
        require(reputations[user].reputation == 0, "Already initialized");
        
        reputations[user] = ReputationData({
            reputation: BASE_REPUTATION,
            lockedReputation: 0,
            totalEarned: 0,
            totalLost: 0,
            lastUpdated: block.timestamp
        });
        
        emit ReputationInitialized(user, BASE_REPUTATION);
    }
    
    /**
     * @notice Reward user with reputation points
     * @param user User address
     * @param amount Amount to reward
     */
    function rewardReputation(address user, uint256 amount) external onlyAuthorized {
        ReputationData storage data = reputations[user];
        
        // Initialize if not exists
        if (data.reputation == 0) {
            data.reputation = BASE_REPUTATION;
        }
        
        uint256 newReputation = data.reputation + amount;
        if (newReputation > MAX_REPUTATION) {
            newReputation = MAX_REPUTATION;
        }
        
        data.reputation = newReputation;
        data.totalEarned += amount;
        data.lastUpdated = block.timestamp;
        
        emit ReputationRewarded(user, amount, newReputation);
    }
    
    /**
     * @notice Penalize user reputation
     * @param user User address
     * @param amount Amount to penalize
     */
    function penalizeReputation(address user, uint256 amount) external onlyAuthorized {
        ReputationData storage data = reputations[user];
        
        require(data.reputation > 0, "User not initialized");
        
        uint256 availableReputation = data.reputation - data.lockedReputation;
        require(availableReputation >= amount, "Insufficient available reputation");
        
        data.reputation -= amount;
        data.totalLost += amount;
        data.lastUpdated = block.timestamp;
        
        emit ReputationPenalized(user, amount, data.reputation);
    }
    
    /**
     * @notice Lock reputation for staking
     * @param user User address
     * @param amount Amount to lock
     */
    function lockReputation(address user, uint256 amount) external onlyAuthorized {
        ReputationData storage data = reputations[user];
        
        require(data.reputation > 0, "User not initialized");
        
        uint256 availableReputation = data.reputation - data.lockedReputation;
        require(availableReputation >= amount, "Insufficient available reputation");
        
        data.lockedReputation += amount;
        data.lastUpdated = block.timestamp;
        
        emit ReputationLocked(user, amount);
    }
    
    /**
     * @notice Unlock previously locked reputation
     * @param user User address
     * @param amount Amount to unlock
     */
    function unlockReputation(address user, uint256 amount) external onlyAuthorized {
        ReputationData storage data = reputations[user];
        
        require(data.lockedReputation >= amount, "Insufficient locked reputation");
        
        data.lockedReputation -= amount;
        data.lastUpdated = block.timestamp;
        
        emit ReputationUnlocked(user, amount);
    }
    
    /**
     * @notice Authorize a contract to manage reputation
     * @param contractAddress Contract to authorize
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }
    
    /**
     * @notice Revoke contract authorization
     * @param contractAddress Contract to revoke
     */
    function revokeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
        emit ContractRevoked(contractAddress);
    }
    
    // View functions
    function getReputation(address user) external view returns (uint256) {
        return reputations[user].reputation;
    }
    
    function getAvailableReputation(address user) external view returns (uint256) {
        ReputationData memory data = reputations[user];
        return data.reputation - data.lockedReputation;
    }
    
    function getLockedReputation(address user) external view returns (uint256) {
        return reputations[user].lockedReputation;
    }
    
    function getReputationData(address user) external view returns (ReputationData memory) {
        return reputations[user];
    }
    
    function getReputationLevel(address user) external view returns (string memory) {
        uint256 rep = reputations[user].reputation;
        
        if (rep >= 5000) return "Elite";
        if (rep >= 3000) return "Expert";
        if (rep >= 2000) return "Advanced";
        if (rep >= 1500) return "Intermediate";
        if (rep >= 1000) return "Novice";
        return "Beginner";
    }
}