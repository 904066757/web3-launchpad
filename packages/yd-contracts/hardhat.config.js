require("dotenv").config();
require("@nomiclabs/hardhat-ethers"); // 改为使用 nomiclabs 的 ethers 插件
require('@openzeppelin/hardhat-upgrades');
require('@typechain/hardhat');

// 检查环境变量
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
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
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5", // 改为 ethers-v5
    alwaysGenerateOverloads: false,
    externalArtifacts: ['externalArtifacts/*.json']
  }
}