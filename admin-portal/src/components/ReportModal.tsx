import React from 'react';
import { X } from 'lucide-react';

const ReportModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Decrypted Emergency Report</h2>
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
          {report}
        </pre>
      </div>
    </div>
  );
};

export default ReportModal;