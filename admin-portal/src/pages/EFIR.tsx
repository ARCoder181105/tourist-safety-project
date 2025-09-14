import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock services for demo purposes
const getSosHistory = async () => [
    { _id: '1', incidentType: 'Medical Emergency', status: 'active', tourist: { walletAddress: '0x123...abc'}, onChainProof: { sosId: '1' } }
];
const fileEFIR = async (data) => console.log("Filing E-FIR:", data);

const EFIRPage = () => {
  const [sosEvents, setSosEvents] = useState([]);
  const [selectedSos, setSelectedSos] = useState(null);
  const [firSummary, setFirSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSosHistory().then(setSosEvents);
  }, []);
  
  const handleFileFir = async () => {
    if (!firSummary || !selectedSos) return alert("Please select an SOS and write a summary.");
    setLoading(true);
    try {
        const firData = {
            sosId: selectedSos.onChainProof.sosId,
            summary: firSummary,
        };
        await fileEFIR(firData);
        alert("E-FIR has been successfully filed on the blockchain.");
        setSelectedSos(null);
        setFirSummary('');
    } catch (error) {
        alert("Failed to file E-FIR: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh] space-x-4">
      
      {/* SOS List */}
      <motion.div
        className="w-1/3 bg-white p-4 rounded-lg shadow-md overflow-y-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">SOS Events Requiring FIR</h2>
        <ul className="space-y-2">
          <AnimatePresence>
            {sosEvents.map(sos => (
              <motion.li
                key={sos._id}
                onClick={() => setSelectedSos(sos)}
                className={`p-3 border rounded-lg cursor-pointer ${selectedSos?._id === sos._id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'}`}
                whileHover={{ scale: 1.03, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                layout
              >
                <p className="font-semibold">{sos.incidentType}</p>
                <p className="text-sm text-gray-600">Tourist: {sos.tourist.walletAddress.substring(0,12)}...</p>
                <p className={`text-xs font-bold ${sos.status === 'active' ? 'text-red-500' : 'text-green-500'}`}>{sos.status.toUpperCase()}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>

      {/* FIR Filing Form */}
      <div className="w-2/3 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">File Electronic First Information Report (E-FIR)</h2>
        <AnimatePresence>
          {selectedSos ? (
            <motion.div
              key={selectedSos._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4">Filing for <span className="font-mono bg-gray-200 p-1 rounded">{`SOS ID: ${selectedSos.onChainProof.sosId}`}</span></p>
              <textarea 
                value={firSummary}
                onChange={(e) => setFirSummary(e.target.value)}
                placeholder="Write official summary of the incident and actions taken..."
                className="w-full p-2 border rounded-md h-48"
              />
              <motion.button
                onClick={handleFileFir} 
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
              >
                {loading ? "Filing..." : "File E-FIR on Blockchain"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-gray-500"
            >
              <p>Select an SOS event from the left to file an E-FIR.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EFIRPage;
