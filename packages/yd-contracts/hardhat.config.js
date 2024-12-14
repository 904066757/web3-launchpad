require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

// 检查环境变量
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "london"
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [PRIVATE_KEY]
    },
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },
  // 添加保存代理地址的配置
  paths: {
    // 将在这个目录下保存代理合约的部署信息
    cache: "./cache",
    artifacts: "./artifacts"
  }
}