import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import AlertCard from '../components/AlertCard';
import ReportModal from '../components/ReportModal';
import { getSosHistory, decryptSos } from '../services/sosService';

const SosPage = () => {
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAlertId, setNewAlertId] = useState<string | null>(null);
  const [decryptedReport, setDecryptedReport] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const socket = useSocket();

  // Effect to fetch initial data and listen for live updates
  useEffect(() => {
    // 1. Fetch historical SOS alerts when the page loads
    const fetchHistory = async () => {
        try {
            const history = await getSosHistory();
            setSosAlerts(history);
        } catch (err) {
            setError("Failed to fetch SOS history.");
        } finally {
            setLoading(false);
        }
    };
    
    fetchHistory();

    // 2. Listen for new live alerts via WebSocket
    if (socket) {
      const handleNewSOS = (newAlert: any) => {
        console.log('Received new SOS via WebSocket:', newAlert);
        
        // Add the new alert to the top of the list, preventing duplicates
        setSosAlerts(prevAlerts => {
            if (prevAlerts.find(alert => alert._id === newAlert._id)) {
                return prevAlerts;
            }
            return [newAlert, ...prevAlerts];
        });
        
        setNewAlertId(newAlert._id);
        
        // Remove the highlight effect after a few seconds
        setTimeout(() => setNewAlertId(null), 5000);
      };

      socket.on('newSOS', handleNewSOS);

      // Cleanup listener when the component unmounts
      return () => {
        socket.off('newSOS', handleNewSOS);
      };
    }
  }, [socket]);

  // Function to handle the decryption request
  const handleDecrypt = async (sosId: string) => {
    try {
        const data = await decryptSos(sosId);
        setDecryptedReport(data.report); // The police service returns an object with a `report` property
        setIsModalOpen(true);
    } catch (error: any) {
        alert("Failed to decrypt report: " + error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading SOS history...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="text-red-500 text-center text-lg font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live SOS Alerts</h1>
          <p className="text-gray-600">Monitor and respond to emergency situations in real-time</p>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{sosAlerts.length} Active Alerts</h2>
              <p className="text-sm text-gray-500">Real-time monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${socket ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">{socket ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sosAlerts.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No active alerts</h3>
                <p className="text-gray-500">Listening for new emergency signals</p>
              </div>
            </div>
          ) : (
            sosAlerts.map((alert) => (
              <AlertCard 
                key={alert._id} 
                alert={alert} 
                isNew={alert._id === newAlertId}
                onDecrypt={() => handleDecrypt(alert._id)} 
              />
            ))
          )}
        </div>
      </div>

      {/* The Modal for displaying the decrypted report */}
      {isModalOpen && (
        <ReportModal report={decryptedReport} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default SosPage;