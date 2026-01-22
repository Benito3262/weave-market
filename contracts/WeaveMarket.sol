// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WeaveMarket
 * @notice Individual binary prediction market contract
 */
contract WeaveMarket is ReentrancyGuard {
    
    // Structs
    struct Bet {
        address bettor;
        bool outcome; // true = YES, false = NO
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }
    
    // State variables
    string public question;
    uint256 public endTime;
    address public creator;
    address public factory;
    uint256 public platformFeePercent;
    
    bool public resolved;
    bool public disputed;
    bool public winningOutcome; // true = YES won, false = NO won
    
    uint256 public totalYesBets;
    uint256 public totalNoBets;
    uint256 public totalVolume;
    uint256 public betCount;
    
    mapping(uint256 => Bet) public bets;
    mapping(address => uint256[]) public userBets;
    
    // Events
    event BetPlaced(
        uint256 indexed betId,
        address indexed bettor,
        bool outcome,
        uint256 amount,
        uint256 timestamp
    );
    
    event MarketResolved(
        bool winningOutcome,
        uint256 totalYesBets,
        uint256 totalNoBets,
        uint256 timestamp
    );
    
    event RewardClaimed(
        address indexed winner,
        uint256 amount,
        uint256 timestamp
    );
    
    event MarketDisputed(
        address indexed disputer,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call");
        _;
    }
    
    modifier marketOpen() {
        require(block.timestamp < endTime, "Market closed");
        require(!resolved, "Market already resolved");
        _;
    }
    
    modifier marketResolved() {
        require(resolved, "Market not resolved");
        require(!disputed, "Market is disputed");
        _;
    }
    
    constructor(
        string memory _question,
        uint256 _endTime,
        address _creator,
        uint256 _platformFeePercent,
        address _factory
    ) {
        question = _question;
        endTime = _endTime;
        creator = _creator;
        platformFeePercent = _platformFeePercent;
        factory = _factory;
    }
    
    /**
     * @notice Place a bet on the market
     * @param outcome true for YES, false for NO
     */
    function placeBet(bool outcome) external payable marketOpen nonReentrant {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(msg.value >= 0.001 ether, "Minimum bet is 0.001 ETH");
        
        betCount++;
        
        bets[betCount] = Bet({
            bettor: msg.sender,
            outcome: outcome,
            amount: msg.value,
            timestamp: block.timestamp,
            claimed: false
        });
        
        userBets[msg.sender].push(betCount);
        
        if (outcome) {
            totalYesBets += msg.value;
        } else {
            totalNoBets += msg.value;
        }
        
        totalVolume += msg.value;
        
        emit BetPlaced(betCount, msg.sender, outcome, msg.value, block.timestamp);
    }
    
    /**
     * @notice Resolve the market with the winning outcome
     * @param outcome true if YES won, false if NO won
     */
    function resolveMarket(bool outcome) external onlyFactory nonReentrant {
        require(block.timestamp >= endTime, "Market not ended yet");
        require(!resolved, "Already resolved");
        
        resolved = true;
        winningOutcome = outcome;
        
        emit MarketResolved(outcome, totalYesBets, totalNoBets, block.timestamp);
    }
    
    /**
     * @notice Claim winnings for a bet
     * @param betId The bet ID to claim
     */
    function claimReward(uint256 betId) external marketResolved nonReentrant {
        Bet storage bet = bets[betId];
        
        require(bet.bettor == msg.sender, "Not your bet");
        require(!bet.claimed, "Already claimed");
        require(bet.outcome == winningOutcome, "Bet lost");
        
        bet.claimed = true;
        
        uint256 winningPool = winningOutcome ? totalYesBets : totalNoBets;
        uint256 losingPool = winningOutcome ? totalNoBets : totalYesBets;
        
        // Calculate payout: (bet amount / winning pool) * (total pool - fees)
        uint256 platformFee = (losingPool * platformFeePercent) / 100;
        uint256 totalPayout = losingPool - platformFee;
        
        uint256 userShare = (bet.amount * totalPayout) / winningPool;
        uint256 reward = bet.amount + userShare;
        
        payable(msg.sender).transfer(reward);
        
        emit RewardClaimed(msg.sender, reward, block.timestamp);
    }
    
    /**
     * @notice Claim multiple rewards at once
     * @param betIds Array of bet IDs to claim
     */
    function claimMultipleRewards(uint256[] calldata betIds) external marketResolved nonReentrant {
        uint256 totalReward = 0;
        
        uint256 winningPool = winningOutcome ? totalYesBets : totalNoBets;
        uint256 losingPool = winningOutcome ? totalNoBets : totalYesBets;
        uint256 platformFee = (losingPool * platformFeePercent) / 100;
        uint256 totalPayout = losingPool - platformFee;
        
        for (uint256 i = 0; i < betIds.length; i++) {
            Bet storage bet = bets[betIds[i]];
            
            if (bet.bettor == msg.sender && !bet.claimed && bet.outcome == winningOutcome) {
                bet.claimed = true;
                
                uint256 userShare = (bet.amount * totalPayout) / winningPool;
                totalReward += bet.amount + userShare;
            }
        }
        
        require(totalReward > 0, "No rewards to claim");
        
        payable(msg.sender).transfer(totalReward);
        
        emit RewardClaimed(msg.sender, totalReward, block.timestamp);
    }
    
    /**
     * @notice Dispute a market resolution
     */
    function disputeMarket() external nonReentrant {
        require(resolved, "Market not resolved");
        require(!disputed, "Already disputed");
        require(block.timestamp < endTime + 7 days, "Dispute period ended");
        
        // Check if user has bets on losing side
        uint256[] memory userBetIds = userBets[msg.sender];
        bool hasLosingBet = false;
        
        for (uint256 i = 0; i < userBetIds.length; i++) {
            if (bets[userBetIds[i]].outcome != winningOutcome) {
                hasLosingBet = true;
                break;
            }
        }
        
        require(hasLosingBet, "Can only dispute if you have losing bets");
        
        disputed = true;
        
        emit MarketDisputed(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Get current odds for YES and NO
     */
    function getOdds() external view returns (uint256 yesOdds, uint256 noOdds) {
        if (totalYesBets == 0 && totalNoBets == 0) {
            return (5000, 5000); // 50/50 if no bets
        }
        
        uint256 total = totalYesBets + totalNoBets;
        yesOdds = (totalYesBets * 10000) / total;
        noOdds = (totalNoBets * 10000) / total;
    }
    
    /**
     * @notice Calculate potential payout for a bet
     */
    function calculatePayout(bool outcome, uint256 amount) external view returns (uint256) {
        uint256 currentYes = totalYesBets;
        uint256 currentNo = totalNoBets;
        
        if (outcome) {
            currentYes += amount;
        } else {
            currentNo += amount;
        }
        
        uint256 winningPool = outcome ? currentYes : currentNo;
        uint256 losingPool = outcome ? currentNo : currentYes;
        
        if (losingPool == 0) return amount;
        
        uint256 platformFee = (losingPool * platformFeePercent) / 100;
        uint256 totalPayout = losingPool - platformFee;
        
        uint256 userShare = (amount * totalPayout) / winningPool;
        return amount + userShare;
    }
    
    // View functions
    function getUserBets(address user) external view returns (uint256[] memory) {
        return userBets[user];
    }
    
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    function getMarketInfo() external view returns (
        string memory _question,
        uint256 _endTime,
        uint256 _totalYesBets,
        uint256 _totalNoBets,
        uint256 _totalVolume,
        bool _resolved,
        bool _disputed
    ) {
        return (
            question,
            endTime,
            totalYesBets,
            totalNoBets,
            totalVolume,
            resolved,
            disputed
        );
    }
    
    // Allow receiving ETH
    receive() external payable {}
}