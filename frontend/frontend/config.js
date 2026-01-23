
const CONFIG = {
    CONTRACTS: {
        MarketFactory: "0x51a9c60cE0aAf5a65DeCEae78723d75715bdcd7b",
        UserProfile: "0x3DF13D3B413B816546d42b2f82b48461EfACffF9",
        ReputationSystem: "0xBb457F9Fe0F817b6E86533Aa10A57CD668404Eb0"
    },
    
    CHAIN_ID: "0x14a34",
    CHAIN_ID_DECIMAL: 84532,
    
    ABIS: {
        ReputationSystem: [
            "function getReputation(address user) view returns (uint256)"
        ],
        
        MarketFactory: [
            "function suggestMarket(string question, uint256 endTime, string metadata) payable",
            "function marketCount() view returns (uint256)",
            "function markets(uint256) view returns (address)"
        ]
    }
};