const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get contract factory
  const Mailbox = await hre.ethers.getContractFactory("Mailbox");

  // Deploy contract
  const mailbox = await Mailbox.deploy(new Uint8Array([0])); // initial key as bytes

  // Wait for deployment to be mined
  await mailbox.waitForDeployment();  // <-- ethers v6 change

  console.log("Mailbox deployed to:", await mailbox.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
