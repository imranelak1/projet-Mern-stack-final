import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const TaskCompletionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Task Completion Trend</h2>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate completion rate for each day
  const chartData = data.map(day => ({
    ...day,
    completionRate: day.tasks > 0 ? Math.round((day.completed / day.tasks) * 100) : 0
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Task Completion Trend</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              labelFormatter={(date) => {
                try {
                  return format(parseISO(date), 'MMM d, yyyy');
                } catch (error) {
                  return date;
                }
              }}
              formatter={(value, name) => {
                if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
                if (name === 'tasks') return [value, 'Total Tasks'];
                if (name === 'completed') return [value, 'Completed Tasks'];
                return [value, name];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="#8884d8"
              name="Completion Rate"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#82ca9d"
              name="Total Tasks"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#ffc658"
              name="Completed Tasks"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskCompletionChart;