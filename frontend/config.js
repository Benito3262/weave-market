const CONFIG = {
    CONTRACTS: {
        MarketFactory: "0x51a9c60cE0aAf5a65DeCEae78723d75715bdcd7b",
        UserProfile: "0x3DF13D3B413B816546d42b2f82b48461EfACffF9",
        ReputationSystem: "0xBb457F9Fe0F817b6E86533Aa10A57CD668404Eb0"
    },
    
    CHAIN_ID: "0x14a34",
    CHAIN_ID_DECIMAL: 84532,
    
    ABI: {
        MarketFactory: [
            "function suggestMarket(string memory question, uint256 endTime, string memory metadata) external payable",
            "function approveMarket(uint256 suggestionId) external",
            "function rejectMarket(uint256 suggestionId) external",
            "function createOfficialMarket(string memory question, uint256 endTime, string memory metadata) external returns (address)",
            "function rewardMarketCreator(uint256 suggestionId) external",
            "function getSuggestion(uint256 suggestionId) external view returns (tuple(address creator, string question, uint256 endTime, string metadata, uint256 stake, uint256 reputationStake, bool approved, bool rejected, address marketAddress, uint256 createdAt))",
            "function getUserSuggestions(address user) external view returns (uint256[])",
            "function getUserMarkets(address user) external view returns (uint256[])",
            "function getMarket(uint256 marketId) external view returns (address)",
            "function marketCount() external view returns (uint256)",
            "function suggestionCount() external view returns (uint256)",
            "function minimumStake() external view returns (uint256)",
            "function reputationStakeRequired() external view returns (uint256)",
            "event MarketSuggested(uint256 indexed suggestionId, address indexed creator, string question, uint256 stake, uint256 endTime)",
            "event MarketApproved(uint256 indexed suggestionId, address indexed marketAddress, uint256 marketId)",
            "event MarketCreated(uint256 indexed marketId, address indexed marketAddress, address indexed creator, string question)"
        ],
        
        UserProfile: [
            "function createProfile(string memory name, string memory details) external",
            "function updateProfile(string memory name, string memory details) external",
            "function updateStats(address user, bool wonBet, uint256 amount) external",
            "function getProfile(address user) external view returns (tuple(address userAddress, string name, string details, uint256 createdAt, uint256 updatedAt, bool exists, uint256 totalBets, uint256 totalWon, uint256 totalVolume))",
            "function hasProfile(address user) external view returns (bool)",
            "function getAddressByName(string memory name) external view returns (address)",
            "function getWinRate(address user) external view returns (uint256)",
            "function totalUsers() external view returns (uint256)",
            "event ProfileCreated(address indexed user, string name, uint256 timestamp)",
            "event ProfileUpdated(address indexed user, string name, string details, uint256 timestamp)"
        ],
        
        ReputationSystem: [
            "function initializeReputation(address user) external",
            "function rewardReputation(address user, uint256 amount) external",
            "function penalizeReputation(address user, uint256 amount) external",
            "function lockReputation(address user, uint256 amount) external",
            "function unlockReputation(address user, uint256 amount) external",
            "function getReputation(address user) external view returns (uint256)",
            "function getAvailableReputation(address user) external view returns (uint256)",
            "function getLockedReputation(address user) external view returns (uint256)",
            "function getReputationData(address user) external view returns (tuple(uint256 reputation, uint256 lockedReputation, uint256 totalEarned, uint256 totalLost, uint256 lastUpdated))",
            "function getReputationLevel(address user) external view returns (string)",
            "event ReputationInitialized(address indexed user, uint256 reputation)",
            "event ReputationRewarded(address indexed user, uint256 amount, uint256 newTotal)",
            "event ReputationPenalized(address indexed user, uint256 amount, uint256 newTotal)"
        ],
        
        WeaveMarket: [
            "function placeBet(bool outcome) external payable",
            "function resolveMarket(bool outcome) external",
            "function claimReward(uint256 betId) external",
            "function claimMultipleRewards(uint256[] calldata betIds) external",
            "function disputeMarket() external",
            "function getOdds() external view returns (uint256 yesOdds, uint256 noOdds)",
            "function calculatePayout(bool outcome, uint256 amount) external view returns (uint256)",
            "function getUserBets(address user) external view returns (uint256[])",
            "function getBet(uint256 betId) external view returns (tuple(address bettor, bool outcome, uint256 amount, uint256 timestamp, bool claimed))",
            "function getMarketInfo() external view returns (string memory _question, uint256 _endTime, uint256 _totalYesBets, uint256 _totalNoBets, uint256 _totalVolume, bool _resolved, bool _disputed)",
            "function question() external view returns (string)",
            "function endTime() external view returns (uint256)",
            "function resolved() external view returns (bool)",
            "function disputed() external view returns (bool)",
            "function totalYesBets() external view returns (uint256)",
            "function totalNoBets() external view returns (uint256)",
            "function totalVolume() external view returns (uint256)",
            "function betCount() external view returns (uint256)",
            "event BetPlaced(uint256 indexed betId, address indexed bettor, bool outcome, uint256 amount, uint256 timestamp)",
            "event MarketResolved(bool winningOutcome, uint256 totalYesBets, uint256 totalNoBets, uint256 timestamp)",
            "event RewardClaimed(address indexed winner, uint256 amount, uint256 timestamp)"
        ]
    }
};