require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", 
      accounts: ["0x5dac4eee0ef48f1d1cbe1a2ed75899ce7fcdb2d6cd6b067b0a1b395dd9a0251b"] 
    }
  }
};