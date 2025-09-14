import { ethers } from "ethers";

// ❗ IMPORTANT: Update with your deployed contract address and RPC URL
const SOS_CONTRACT_ADDRESS = import.meta.env.VITE_SOSALERT_CONTRACT_ADDRESS || ""; 

const sosAlertAbi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "sosId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "tourist", "type": "address" },
      { "indexed": false, "internalType": "bytes32", "name": "initialReportHash", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "SosTriggered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "sosCounter",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "bytes32", "name": "_initialReportHash", "type": "bytes32" } ],
    "name": "triggerSOS",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// --- ADD THIS FUNCTION BACK ---
/**
 * Creates a new random Ethereum wallet.
 * This is used during the registration process.
 * @returns An object containing the ethers Wallet instance, its address, and its private key.
 */
export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    instance: wallet,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};
// -----------------------------

export const triggerSOSOnChain = async (signer: ethers.Signer, reportHash: string): Promise<string> => {
    if (!SOS_CONTRACT_ADDRESS) {
        throw new Error("SOS_CONTRACT_ADDRESS is not defined in environment variables.");
    }

    const sosContract = new ethers.Contract(SOS_CONTRACT_ADDRESS, sosAlertAbi, signer);
    
    console.log("Requesting user to sign SOS transaction...");
    const tx = await sosContract.triggerSOS(reportHash);
    const receipt = await tx.wait();
    
    if (!receipt) {
        throw new Error("Transaction failed to get a receipt.");
    }

    console.log("SOS transaction successful:", receipt.hash);
    return receipt.hash;
};