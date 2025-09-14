import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "sepolia",
  chainType: "l1",
});


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Identity Contract
  const identity = await ethers.deployContract("Identity");
  await identity.waitForDeployment();
  console.log(`✅ Identity contract deployed to: ${await identity.getAddress()}`);

  // Deploy SosAlert Contract
  const sosAlert = await ethers.deployContract("SosAlert");
  await sosAlert.waitForDeployment();
  console.log(`✅ SosAlert contract deployed to: ${await sosAlert.getAddress()}`);

  // Deploy EFIR Contract
  const efir = await ethers.deployContract("EFIR");
  await efir.waitForDeployment();
  console.log(`✅ EFIR contract deployed to: ${await efir.getAddress()}`);

  // Set the deployer as a police authority on the EFIR contract for testing
  console.log("\nSetting deployer as a police authority...");
  const tx = await efir.addPoliceAuthority(deployer.address);
  await tx.wait();
  console.log(`✅ Deployer (${deployer.address}) has been granted police authority.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});