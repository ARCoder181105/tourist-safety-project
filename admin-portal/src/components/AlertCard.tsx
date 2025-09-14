import React from 'react';
import { ShieldAlert, MapPin, Clock } from 'lucide-react';
import { twMerge } from 'tailwind-merge'; // A utility to merge tailwind classes

// You may need to install this: npm install clsx tailwind-merge
import clsx from 'clsx';

// A simple interface for the alert object's structure
interface Alert {
  _id: string;
  incidentType: string;
  description: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
}

interface AlertCardProps {
  alert: Alert;
  isNew?: boolean; // Optional prop to indicate a new alert
  onDecrypt: () => void; // A function to call when the decrypt button is clicked
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, isNew, onDecrypt }) => {
  // Conditionally apply a pulsing border for new alerts
  const cardClasses = clsx(
    "bg-white rounded-lg shadow-md p-4 border-l-4",
    {
      "border-blue-500 animate-pulse": isNew,
      "border-red-500": !isNew,
    }
  );

  return (
    <div className={cardClasses}>
      <div className="flex items-center mb-2">
        <ShieldAlert className="w-6 h-6 text-red-500 mr-3" />
        <h3 className="text-lg font-bold">{alert.incidentType}</h3>
      </div>
      <p className="text-gray-700 mb-3 h-12 overflow-hidden">{alert.description || "No description provided."}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Location: {alert.location.coordinates[1].toFixed(4)}, {alert.location.coordinates[0].toFixed(4)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Time: {new Date(alert.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4">
          <button onClick={onDecrypt} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              View Details & Decrypt
          </button>
      </div>
    </div>
  );
};

export default AlertCard;