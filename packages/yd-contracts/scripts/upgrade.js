const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  // 获取命令行参数
  const contractName = process.env.CONTRACT;
  if (!contractName) {
    throw new Error("Please provide CONTRACT name, eg: CONTRACT=MetaCoinUpgradeable npm run upgrade:local");
  }

  // 读取部署信息
  const deployFile = path.join(__dirname, `../deployments/${network.name}.json`);
  if (!fs.existsSync(deployFile)) {
    throw new Error(`No deployment found for network ${network.name}`);
  }

  const deployments = JSON.parse(fs.readFileSync(deployFile));
  const contractInfo = deployments[contractName];
  
  if (!contractInfo) {
    throw new Error(`No deployment found for contract ${contractName}`);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address);

  const Contract = await ethers.getContractFactory(contractName);
  console.log(`Upgrading ${contractName}...`);
  
  // 升级合约
  await upgrades.upgradeProxy(contractInfo.proxy, Contract);
  console.log("Contract upgraded");

  // 获取新的实现地址
  const newImplementationAddress = await upgrades.erc1967.getImplementationAddress(contractInfo.proxy);
  console.log("New implementation address:", newImplementationAddress);
  
  // 更新部署信息
  deployments[contractName].implementation = newImplementationAddress;
  fs.writeFileSync(deployFile, JSON.stringify(deployments, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});