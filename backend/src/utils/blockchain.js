const { ethers } = require("ethers");
const IdentityABI = require("../abi/Identity.json");
const SosAlertABI = require("../abi/SosAlert.json");
// const EFIRABI = require("../abi/EFIR.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.BACKEND_WALLET_PRIVATE_KEY, provider);

const identityContract = new ethers.Contract(process.env.IDENTITY_CONTRACT_ADDRESS, IdentityABI.abi, wallet);
const sosAlertContract = new ethers.Contract(process.env.SOSALERT_CONTRACT_ADDRESS, SosAlertABI.abi, wallet);

// We assume the user's mobile app signs and sends this transaction
// This function is for the backend to verify or interact if needed
async function triggerSOSOnChain(reportHash, userWallet) {
    const tx = await sosAlertContract.connect(userWallet).triggerSOS(reportHash);
    const receipt = await tx.wait();
    
    // Find the event in the transaction receipt to get the sosId
    const event = receipt.logs.find(log => {
        try {
            const parsedLog = sosAlertContract.interface.parseLog(log);
            return parsedLog.name === "SosTriggered";
        } catch (error) {
            return false;
        }
    });

    if (!event) throw new Error("SosTriggered event not found in transaction receipt.");
    
    const sosId = event.args.sosId.toString();
    
    return { txHash: tx.hash, sosId };
}

// NOTE: This is a simplified function where the backend orchestrates the registration
// A full production app would have the user sign the message on the frontend.
async function registerUserOnChain(userAddress, credentialHash) {
    const tx = await identityContract.registerUser(credentialHash);
    await tx.wait();
    return tx.hash;
}

module.exports = { provider,registerUserOnChain, triggerSOSOnChain, sosAlertContract };