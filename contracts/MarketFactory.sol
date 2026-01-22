// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./WeaveMarket.sol";
import "./UserProfile.sol";
import "./ReputationSystem.sol";
contract MarketFactory is Ownable, ReentrancyGuard {
struct MarketSuggestion {
    address creator;
    string question;
    uint256 endTime;
    string metadata;
    uint256 stake;
    uint256 reputationStake;
    bool approved;
    bool rejected;
    address marketAddress;
    uint256 createdAt;
}

UserProfile public userProfile;
ReputationSystem public reputationSystem;

uint256 public minimumStake = 0.01 ether;
uint256 public reputationStakeRequired = 50;
uint256 public platformFeePercent = 2;
uint256 public marketCount;
uint256 public suggestionCount;

mapping(uint256 => MarketSuggestion) public suggestions;
mapping(uint256 => address) public markets;
mapping(address => uint256[]) public userSuggestions;
mapping(address => uint256[]) public userMarkets;

event MarketSuggested(
    uint256 indexed suggestionId,
    address indexed creator,
    string question,
    uint256 stake,
    uint256 endTime
);

event MarketApproved(
    uint256 indexed suggestionId,
    address indexed marketAddress,
    uint256 marketId
);

event MarketRejected(
    uint256 indexed suggestionId,
    address indexed creator
);

event MarketCreated(
    uint256 indexed marketId,
    address indexed marketAddress,
    address indexed creator,
    string question
);

event StakeReturned(
    address indexed creator,
    uint256 amount,
    uint256 reputation
);

constructor(
    address _userProfile,
    address _reputationSystem
) Ownable(msg.sender) {
    userProfile = UserProfile(_userProfile);
    reputationSystem = ReputationSystem(_reputationSystem);
}

modifier hasProfile() {
    require(userProfile.hasProfile(msg.sender), "Must create profile first");
    _;
}

modifier sufficientReputation() {
    require(
        reputationSystem.getReputation(msg.sender) >= 500,
        "Insufficient reputation to suggest markets"
    );
    _;
}

function suggestMarket(
    string memory question,
    uint256 endTime,
    string memory metadata
) external payable hasProfile sufficientReputation nonReentrant {
    require(bytes(question).length > 10, "Question too short");
    require(endTime > block.timestamp + 1 hours, "End time must be at least 1 hour in future");
    require(msg.value >= minimumStake, "Insufficient stake");
    
    uint256 userReputation = reputationSystem.getReputation(msg.sender);
    require(userReputation >= reputationStakeRequired, "Insufficient reputation for stake");
    
    suggestionCount++;
    
    suggestions[suggestionCount] = MarketSuggestion({
        creator: msg.sender,
        question: question,
        endTime: endTime,
        metadata: metadata,
        stake: msg.value,
        reputationStake: reputationStakeRequired,
        approved: false,
        rejected: false,
        marketAddress: address(0),
        createdAt: block.timestamp
    });
    
    userSuggestions[msg.sender].push(suggestionCount);
    
    reputationSystem.lockReputation(msg.sender, reputationStakeRequired);
    
    emit MarketSuggested(suggestionCount, msg.sender, question, msg.value, endTime);
}

function approveMarket(uint256 suggestionId) external onlyOwner nonReentrant {
    MarketSuggestion storage suggestion = suggestions[suggestionId];
    
    require(!suggestion.approved, "Already approved");
    require(!suggestion.rejected, "Already rejected");
    require(suggestion.endTime > block.timestamp, "Market end time passed");
    
    WeaveMarket newMarket = new WeaveMarket(
        suggestion.question,
        suggestion.endTime,
        suggestion.creator,
        platformFeePercent,
        address(this)
    );
    
    marketCount++;
    markets[marketCount] = address(newMarket);
    userMarkets[suggestion.creator].push(marketCount);
    
    suggestion.approved = true;
    suggestion.marketAddress = address(newMarket);
    
    (bool success, ) = payable(address(newMarket)).call{value: suggestion.stake}("");
    require(success, "Transfer failed");
    
    emit MarketApproved(suggestionId, address(newMarket), marketCount);
    emit MarketCreated(marketCount, address(newMarket), suggestion.creator, suggestion.question);
}

function rejectMarket(uint256 suggestionId) external onlyOwner nonReentrant {
    MarketSuggestion storage suggestion = suggestions[suggestionId];
    
    require(!suggestion.approved, "Already approved");
    require(!suggestion.rejected, "Already rejected");
    
    suggestion.rejected = true;
    
    (bool success, ) = payable(suggestion.creator).call{value: suggestion.stake}("");
    require(success, "Transfer failed");
    
    reputationSystem.unlockReputation(suggestion.creator, suggestion.reputationStake);
    reputationSystem.penalizeReputation(suggestion.creator, 20);
    
    emit MarketRejected(suggestionId, suggestion.creator);
}

function createOfficialMarket(
    string memory question,
    uint256 endTime,
    string memory metadata
) external onlyOwner returns (address) {
    require(bytes(question).length > 10, "Question too short");
    require(endTime > block.timestamp, "Invalid end time");
    
    WeaveMarket newMarket = new WeaveMarket(
        question,
        endTime,
        msg.sender,
        platformFeePercent,
        address(this)
    );
    
    marketCount++;
    markets[marketCount] = address(newMarket);
    
    emit MarketCreated(marketCount, address(newMarket), msg.sender, question);
    
    return address(newMarket);
}

function rewardMarketCreator(uint256 suggestionId) external nonReentrant {
    MarketSuggestion storage suggestion = suggestions[suggestionId];
    
    require(suggestion.approved, "Market not approved");
    require(suggestion.marketAddress != address(0), "Invalid market");
    
    WeaveMarket market = WeaveMarket(payable(suggestion.marketAddress));
    require(market.resolved(), "Market not resolved yet");
    require(!market.disputed(), "Market is disputed");
    
    reputationSystem.unlockReputation(suggestion.creator, suggestion.reputationStake);
    reputationSystem.rewardReputation(suggestion.creator, 10);
    
    emit StakeReturned(suggestion.creator, 0, suggestion.reputationStake + 10);
}

function getSuggestion(uint256 suggestionId) external view returns (MarketSuggestion memory) {
    return suggestions[suggestionId];
}

function getUserSuggestions(address user) external view returns (uint256[] memory) {
    return userSuggestions[user];
}

function getUserMarkets(address user) external view returns (uint256[] memory) {
    return userMarkets[user];
}

function getMarket(uint256 marketId) external view returns (address) {
    return markets[marketId];
}

function setMinimumStake(uint256 _minimumStake) external onlyOwner {
    minimumStake = _minimumStake;
}

function setReputationStake(uint256 _reputationStake) external onlyOwner {
    reputationStakeRequired = _reputationStake;
}

function setPlatformFee(uint256 _feePercent) external onlyOwner {
    require(_feePercent <= 10, "Fee too high");
    platformFeePercent = _feePercent;
}

function withdrawFees() external onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}("");
    require(success, "Transfer failed");
}

receive() external payable {}
}