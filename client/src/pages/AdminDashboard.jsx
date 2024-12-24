import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/dashboard/StatCard';
import TaskCompletionChart from '../components/dashboard/TaskCompletionChart';
import UserActivityChart from '../components/dashboard/UserActivityChart';
import UsersTable from '../components/dashboard/UsersTable';
import { api } from '../services/mockApi';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('7');

  // Fetch analytics data
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => api.getAnalytics(dateRange)
  });

  // Fetch users data
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getAllUsers()
  });
  
  const isLoading = isAnalyticsLoading || isUsersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isUsersError) {
    return <div>Error loading users data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {analytics?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.summary.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {analytics?.taskCompletionRate && (
        <div className="grid grid-cols-1 gap-6">
          <TaskCompletionChart data={analytics.taskCompletionRate} />
        </div>
      )}

      {analytics?.userActivity && (
        <UserActivityChart data={analytics.userActivity} />
      )}
      
      {users && <UsersTable users={users} />}
    </div>
  );
};

export default AdminDashboard;
