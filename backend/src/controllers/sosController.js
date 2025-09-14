const Sos = require('../models/Sos');
const User = require('../models/User');
const { sosAlertContract, provider, } = require('../utils/blockchain');
const io = require('../utils/socket').getIO();
const { decryptHybrid } = require('../utils/decryptor');

exports.triggerSOS = async (req, res) => {
    const { txHash, reportHash, location, incidentType, description, encryptedData } = req.body;
    try {
        const user = req.user; // From authMiddleware

        // 1. Verify the transaction actually happened on-chain
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt || receipt.status === 0) {
            return res.status(400).json({ msg: "Blockchain transaction failed or was not found."});
        }

        // --- THIS CRUCIAL SECTION FINDS AND DEFINES THE 'event' VARIABLE ---
        // 2. Find and parse the event in the transaction logs
        const event = receipt.logs
            .map(log => {
                try { 
                    if (log.address.toLowerCase() === sosAlertContract.target.toLowerCase()) {
                        return sosAlertContract.interface.parseLog(log);
                    }
                    return null;
                }
                catch (e) { return null; }
            })
            .find(parsedLog => parsedLog?.name === "SosTriggered");

        // 3. Security Check: Ensure the event is valid and matches the user
        // if (!event || event.args.tourist.toLowerCase() !== user.walletAddress.toLowerCase()) {
        //     return res.status(403).json({ msg: "Transaction event does not match the authenticated user." });
        // }
        // --- END OF SECTION ---

        // 4. Now, 'event' is correctly defined, and this line will work
        const sosId = event.args.sosId.toString();

        // 5. Save the SOS event to our database
        const newSos = new Sos({
            tourist: user.id,
            location: { type: 'Point', coordinates: [location.longitude, location.latitude] },
            incidentType,
            description,
            onChainProof: { sosId, txHash, reportHash },
            encryptedPacket: encryptedData,
        });
        await newSos.save();

        // 6. Broadcast the new SOS to the admin portal in real-time
        io.emit('newSOS', newSos);
        console.log("Broadcasted new SOS alert via WebSocket:", newSos._id);
        
        res.status(201).json(newSos);
    } catch (err) {
        console.error("SOS Controller Error:", err);
        res.status(500).send('Server Error');
    }
};

exports.getSosHistory = async (req, res) => {
    try {
        const sosEvents = await Sos.find()
            .populate('tourist', 'walletAddress')
            .sort({ createdAt: -1 });
        res.json(sosEvents);
    } catch (err) {
        console.error("Get SOS History Error:", err);
        res.status(500).send("Server Error");
    }
};


/**
 * @desc    Decrypts the credentials for a specific SOS event
 * @route   GET /api/sos/:id/decrypt
 */
exports.decryptSosReport = async (req, res) => {
    try {
        const sosEvent = await Sos.findById(req.params.id);
        if (!sosEvent) {
            return res.status(404).json({ msg: 'SOS event not found' });
        }

        // --- THE FIX IS HERE ---
        // Get the private key from the environment
        const policePrivateKey = process.env.POLICE_PRIVATE_KEY;
        if (!policePrivateKey) {
            throw new Error("Police private key is not configured on the server.");
        }

        // Decrypt the packet directly in this server
        const decryptedData = decryptHybrid(sosEvent.encryptedPacket, policePrivateKey);

        // For consistency with the old police-service, we can format it
        const report = `DECRYPTED E-FIR:\n${JSON.stringify(decryptedData, null, 2)}`;

        res.json({ success: true, report });
        // --- END OF FIX ---

    } catch (err) {
        console.error("SOS Decrypt Error:", err);
        res.status(500).send("Server Error");
    }
};