const hre = require("hardhat");
const crypto = require('crypto');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Generate PGP key pair (simplified example using crypto for demonstration)
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  console.log("Private key (keep this safe!):\n", privateKey);

  // Get contract factory
  const Mailbox = await hre.ethers.getContractFactory("Mailbox");

  // Deploy contract with PGP public key as bytes
  const mailbox = await Mailbox.deploy(new Uint8Array(publicKey));

  // Wait for deployment to be mined (ethers v6 syntax)
  await mailbox.waitForDeployment();

  console.log("Mailbox deployed to:", await mailbox.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
