import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();
import { Identity } from "../typechain-types";
import { Signer } from "ethers";

describe("Identity", function () {
  let identity: Identity;
  let user: Signer;

  // Using beforeEach to set up a clean state for each test
  beforeEach(async function() {
    [user] = await ethers.getSigners();
    
    const IdentityFactory = await ethers.getContractFactory("Identity");
    identity = await IdentityFactory.deploy();
    await identity.waitForDeployment();
  });

  it("Should allow a user to register with a credential hash", async function () {
    const credentialHash = ethers.keccak256(ethers.toUtf8Bytes("my-secret-credentials"));

    await expect(identity.connect(user).registerUser(credentialHash))
      .to.emit(identity, "UserRegistered")
      .withArgs(await user.getAddress(), credentialHash);

    expect(await identity.credentialHashes(await user.getAddress())).to.equal(credentialHash);
  });
});