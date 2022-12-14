// require("dotenv").config();
// require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
// require("hardhat-gas-reporter");
// require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.0",
    paths: {
      artifacts: "./front-end/src/artifacts",
    },
    // settings : {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200
    //   }
    // }
  },
  networks: {
    hardhat: {
      name: "localhost",
      chainId: 1337,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/fd1917e997924da49884de60bfebe3f6",
      accounts: ["0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1"],
    },
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || "",
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};
