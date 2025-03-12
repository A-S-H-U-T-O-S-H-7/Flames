import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-4 transition-all duration-300 border border-[#22c7d5] hover:shadow-lg hover:shadow-[#22c7d560]">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-opacity-20 mr-4`} style={{ backgroundColor: `${color}30` }}>
          <div style={{ color: color }}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;