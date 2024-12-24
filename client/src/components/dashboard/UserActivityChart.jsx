import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const UserActivityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">User Activity</h2>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Format the data to ensure dates are properly handled
  const formattedData = data.map(item => ({
    ...item,
    date: item.date ? item.date : new Date().toISOString().split('T')[0], // Fallback to current date if missing
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">User Activity</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                try {
                  return format(parseISO(date), 'MMM d');
                } catch (error) {
                  return '';
                }
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => {
                try {
                  return format(parseISO(date), 'MMM d, yyyy');
                } catch (error) {
                  return date;
                }
              }}
            />
            <Legend />
            <Bar dataKey="tasks" fill="#8884d8" name="Tasks Created" />
            <Bar dataKey="completed" fill="#82ca9d" name="Tasks Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;