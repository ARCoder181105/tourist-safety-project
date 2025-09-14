import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Safe' | 'In Danger';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isSafe = status === 'Safe';

  const bgColor = isSafe ? 'bg-green-100' : 'bg-red-100';
  const textColor = isSafe ? 'text-green-800' : 'text-red-800';
  const Icon = isSafe ? ShieldCheck : ShieldAlert;

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className="w-4 h-4 mr-1" />
      {status}
    </div>
  );
};

export default StatusBadge;