const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  // 获取命令行参数
  const contractName = process.env.CONTRACT;
  if (!contractName) {
    throw new Error("Please provide CONTRACT name, eg: CONTRACT=MetaCoinUpgradeable npm run deploy:local");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约工厂
  const Contract = await ethers.getContractFactory(contractName);
  console.log(`Deploying ${contractName}...`);
  
  // 部署合约
  const contract = await upgrades.deployProxy(Contract, [], {
    initializer: "initialize",
    kind: "transparent"
  });
  
  await contract.waitForDeployment();
  
  // 获取地址
  const proxyAddress = await contract.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);

  // 保存部署信息到文件
  const deployments = {
    network: network.name,
    [contractName]: {
      proxy: proxyAddress,
      implementation: implementationAddress,
      admin: adminAddress,
      deployer: deployer.address
    }
  };

  // 确保目录存在
  const deployDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deployDir)){
    fs.mkdirSync(deployDir);
  }

  // 写入部署信息
  fs.writeFileSync(
    path.join(deployDir, `${network.name}.json`),
    JSON.stringify(deployments, null, 2)
  );

  console.log("Deployed contract addresses:");
  console.log("Proxy:", proxyAddress);
  console.log("Implementation:", implementationAddress);
  console.log("Admin:", adminAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});