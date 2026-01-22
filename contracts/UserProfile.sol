// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract UserProfile {
struct Profile {
    address userAddress;
    string name;
    string details;
    uint256 createdAt;
    uint256 updatedAt;
    bool exists;
    uint256 totalBets;
    uint256 totalWon;
    uint256 totalVolume;
}

mapping(address => Profile) public profiles;
mapping(string => address) public nameToAddress;

uint256 public totalUsers;

event ProfileCreated(
    address indexed user,
    string name,
    uint256 timestamp
);

event ProfileUpdated(
    address indexed user,
    string name,
    string details,
    uint256 timestamp
);

event StatsUpdated(
    address indexed user,
    uint256 totalBets,
    uint256 totalWon,
    uint256 totalVolume
);

function createProfile(
    string memory name,
    string memory details
) external {
    require(!profiles[msg.sender].exists, "Profile already exists");
    require(bytes(name).length > 0, "Name cannot be empty");
    require(bytes(name).length <= 32, "Name too long");
    require(nameToAddress[name] == address(0), "Name already taken");
    
    profiles[msg.sender] = Profile({
        userAddress: msg.sender,
        name: name,
        details: details,
        createdAt: block.timestamp,
        updatedAt: block.timestamp,
        exists: true,
        totalBets: 0,
        totalWon: 0,
        totalVolume: 0
    });
    
    nameToAddress[name] = msg.sender;
    totalUsers++;
    
    emit ProfileCreated(msg.sender, name, block.timestamp);
}

function updateProfile(
    string memory name,
    string memory details
) external {
    require(profiles[msg.sender].exists, "Profile does not exist");
    require(bytes(name).length > 0, "Name cannot be empty");
    require(bytes(name).length <= 32, "Name too long");
    
    Profile storage profile = profiles[msg.sender];
    
    if (keccak256(bytes(profile.name)) != keccak256(bytes(name))) {
        require(nameToAddress[name] == address(0), "Name already taken");
        delete nameToAddress[profile.name];
        nameToAddress[name] = msg.sender;
    }
    
    profile.name = name;
    profile.details = details;
    profile.updatedAt = block.timestamp;
    
    emit ProfileUpdated(msg.sender, name, details, block.timestamp);
}

function updateStats(
    address user,
    bool wonBet,
    uint256 amount
) external {
    require(profiles[user].exists, "Profile does not exist");
    
    Profile storage profile = profiles[user];
    profile.totalBets++;
    profile.totalVolume += amount;
    
    if (wonBet) {
        profile.totalWon++;
    }
    
    emit StatsUpdated(user, profile.totalBets, profile.totalWon, profile.totalVolume);
}

function getProfile(address user) external view returns (Profile memory) {
    return profiles[user];
}

function hasProfile(address user) external view returns (bool) {
    return profiles[user].exists;
}

function getAddressByName(string memory name) external view returns (address) {
    return nameToAddress[name];
}

function getWinRate(address user) external view returns (uint256) {
    Profile memory profile = profiles[user];
    if (profile.totalBets == 0) return 0;
    return (profile.totalWon * 10000) / profile.totalBets;
}
}