import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock service for demo purposes
const getReports = async () => [
  {
    _id: '1',
    incidentType: 'Road Flooding',
    description: 'Main street is flooded near the bridge.',
    tourist: { walletAddress: '0x123...abc' },
    location: { coordinates: [-74.00, 40.71] },
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    incidentType: 'Protest',
    description: 'Protest near city center causing traffic.',
    tourist: { walletAddress: '0x456...def' },
    location: { coordinates: [-73.99, 40.72] },
    createdAt: new Date().toISOString()
  }
];

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading reports...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">User-Submitted Hazard Reports</h1>
      
      {reports.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No reports have been submitted yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, idx) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-blue-700">{report.incidentType}</h2>
                <p className="text-sm text-gray-500 mt-1">Reported by: <span className="font-mono">{report.tourist.walletAddress.substring(0, 10)}...</span></p>
              </div>
              <p className="mb-4 text-gray-700">{report.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>📍 Location: {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}</p>
                <p>🕒 Time: {new Date(report.createdAt).toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
