require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

// 添加错误处理
const provider = () => {
  try {
    return new HDWalletProvider(
      process.env.PRIVATE_KEY,
      "https://eth-sepolia.public.blastapi.io"
    );
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};

module.exports = {
  networks: {
    sepolia: {
      provider: provider,
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 20000000000,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 10000,
      skipDryRun: true,
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "london",
      },
    },
  },
};
