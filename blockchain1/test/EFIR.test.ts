import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();
import { EFIR } from "../typechain-types";
import { Signer } from "ethers";

describe("EFIR", function () {
  let efir: EFIR;
  let owner: Signer, police: Signer, civilian: Signer;

  beforeEach(async function () {
    [owner, police, civilian] = await ethers.getSigners();
    const EFIRFactory = await ethers.getContractFactory("EFIR");
    efir = await EFIRFactory.deploy();
    await efir.waitForDeployment();

    // Grant police authority as part of the setup
    // Use police.address directly for robustness
    await efir.connect(owner).addPoliceAuthority(police.address);
  });

  it("Should allow the owner to add a police authority", async function () {
    expect(await efir.policeAuthorities(police.address)).to.be.true;
  });

  it("Should NOT allow a non-police address to file an FIR", async function () {
    const sosId = 1;
    const firHash = ethers.keccak256(
      ethers.toUtf8Bytes("official-fir-document")
    );

    await expect(
      efir.connect(civilian).fileEFIR(sosId, firHash)
    ).to.be.revertedWith("Only police can call this function");
  });

  it("Should allow a registered police authority to file an FIR", async function () {
    const sosId = 1;
    const firHash = ethers.keccak256(
      ethers.toUtf8Bytes("official-fir-document")
    );

    await expect(efir.connect(police).fileEFIR(sosId, firHash))
      .to.emit(efir, "EFIRFiled")
      .withArgs(sosId, police.address, firHash);

    expect(await efir.firHashes(sosId)).to.equal(firHash);
  });

  it("Should NOT allow filing an FIR for the same SOS ID twice", async function () {
    const sosId = 1;
    const firHash1 = ethers.keccak256(ethers.toUtf8Bytes("first-fir"));
    const firHash2 = ethers.keccak256(ethers.toUtf8Bytes("second-fir"));

    await efir.connect(police).fileEFIR(sosId, firHash1);

    await expect(
      efir.connect(police).fileEFIR(sosId, firHash2)
    ).to.be.revertedWith("E-FIR already filed for this SOS ID");
  });
});
