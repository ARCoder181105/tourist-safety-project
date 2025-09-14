import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();
import { SosAlert } from "../typechain-types";
import { Signer } from "ethers";

describe("SosAlert", function () {
  let sosAlert: SosAlert;
  let tourist: Signer;

  beforeEach(async function() {
    [tourist] = await ethers.getSigners();

    const SosAlertFactory = await ethers.getContractFactory("SosAlert");
    sosAlert = await SosAlertFactory.deploy();
    await sosAlert.waitForDeployment();
  });

  it("Should allow a user to trigger an SOS and emit an event", async function () {
    const reportHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted-efir-packet"));
    const currentCounter = await sosAlert.sosCounter();

    const tx = await sosAlert.connect(tourist).triggerSOS(reportHash);
    
    // Manually getting the block timestamp from the provider
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt!.blockNumber);
    const blockTimestamp = block!.timestamp;

    await expect(tx)
      .to.emit(sosAlert, "SosTriggered")
      .withArgs(currentCounter + 1n, await tourist.getAddress(), reportHash, blockTimestamp);
    
    expect(await sosAlert.sosCounter()).to.equal(currentCounter + 1n);
  });
});