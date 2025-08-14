// scripts/populateMailbox.js
const hre = require("hardhat");

async function main() {
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Populating Mailbox with account:", deployer.address);

  // Connect to existing Mailbox contract (replace with deployed address)
  const MAILBOX_ADDRESS = "0x59620eBc7B23Fa34Fbd2DCF2456D001F9C852ca8"; // hardcoded!
  const Mailbox = await hre.ethers.getContractFactory("Mailbox");
  const mailbox = await Mailbox.attach(MAILBOX_ADDRESS);

  // Example messages
  const messages = [
    "Hello Robert!",
  ];

  for (const msg of messages) {
    const tx = await mailbox.sendMessage(hre.ethers.toUtf8Bytes(msg));
    await tx.wait();
    console.log(`Sent message: "${msg}"`);
  }

  console.log("Mailbox populated!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
