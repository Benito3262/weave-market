const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Weave Market deployment to Base Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy UserProfile
  console.log("📋 Deploying UserProfile...");
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("✅ UserProfile deployed to:", userProfileAddress);

  // Deploy ReputationSystem
  console.log("\n⭐ Deploying ReputationSystem...");
  const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
  const reputationSystem = await ReputationSystem.deploy();
  await reputationSystem.waitForDeployment();
  const reputationSystemAddress = await reputationSystem.getAddress();
  console.log("✅ ReputationSystem deployed to:", reputationSystemAddress);

  // Deploy MarketFactory
  console.log("\n🏭 Deploying MarketFactory...");
  const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
  const marketFactory = await MarketFactory.deploy(
    userProfileAddress,
    reputationSystemAddress
  );
  await marketFactory.waitForDeployment();
  const marketFactoryAddress = await marketFactory.getAddress();
  console.log("✅ MarketFactory deployed to:", marketFactoryAddress);

  // Authorize MarketFactory in ReputationSystem
  console.log("\n🔐 Authorizing MarketFactory in ReputationSystem...");
  const authTx = await reputationSystem.authorizeContract(marketFactoryAddress);
  await authTx.wait();
  console.log("✅ MarketFactory authorized");

  // Create a sample official market
  console.log("\n🎯 Creating sample official market...");
  const endTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days from now
  const createMarketTx = await marketFactory.createOfficialMarket(
    "Will Bitcoin reach $100,000 by February 2026?",
    endTime,
    JSON.stringify({
      category: "Crypto",
      description: "Bitcoin price prediction for February 2026",
      tags: ["bitcoin", "crypto", "price"]
    })
  );
  await createMarketTx.wait();
  console.log("✅ Sample market created");

  // Print deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📊 Contract Addresses:");
  console.log("   UserProfile:      ", userProfileAddress);
  console.log("   ReputationSystem: ", reputationSystemAddress);
  console.log("   MarketFactory:    ", marketFactoryAddress);
  
  console.log("\n🔗 Network: Base Sepolia");
  console.log("🔗 Explorer: https://sepolia.basescan.org");
  
  console.log("\n📝 Next Steps:");
  console.log("   1. Verify contracts on Basescan");
  console.log("   2. Update frontend/.env with contract addresses");
  console.log("   3. Run: cd frontend && npm install && npm run dev");
  
  console.log("\n💡 Verification Commands:");
  console.log(`   npx hardhat verify --network baseSepolia ${userProfileAddress}`);
  console.log(`   npx hardhat verify --network baseSepolia ${reputationSystemAddress}`);
  console.log(`   npx hardhat verify --network baseSepolia ${marketFactoryAddress} ${userProfileAddress} ${reputationSystemAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network: "baseSepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      UserProfile: userProfileAddress,
      ReputationSystem: reputationSystemAddress,
      MarketFactory: marketFactoryAddress
    }
  };

  const fs = require("fs");
  const path = require("path");
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, "baseSepolia.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to deployments/baseSepolia.json");
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });