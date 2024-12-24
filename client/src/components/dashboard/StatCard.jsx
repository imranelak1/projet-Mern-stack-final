import React from 'react';

const StatCard = ({ label, value, change }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-gray-500 text-sm">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
      <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '+' : ''}{change}% from last period
      </p>
    </div>
  );
};

export default StatCard;