// Mock data for testing
export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    taskCount: 15,
    completionRate: 80
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    taskCount: 8,
    completionRate: 65
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the new feature',
    status: 'pending',
    dueDate: '2024-03-25',
    userId: 1
  },
  {
    id: 2,
    title: 'Review Pull Requests',
    description: 'Review and merge pending pull requests',
    status: 'completed',
    dueDate: '2024-03-20',
    userId: 1
  }
];

export const mockAnalytics = {
  summary: [
    { label: 'Total Tasks', value: 156, change: 12 },
    { label: 'Completed Tasks', value: 98, change: 8 },
    { label: 'Active Users', value: 24, change: -3 },
    { label: 'Completion Rate', value: '73%', change: 5 }
  ],
  taskCompletionRate: [
    { date: '2024-03-15', completionRate: 65 },
    { date: '2024-03-16', completionRate: 68 },
    { date: '2024-03-17', completionRate: 72 },
    { date: '2024-03-18', completionRate: 75 },
    { date: '2024-03-19', completionRate: 71 },
    { date: '2024-03-20', completionRate: 73 },
    { date: '2024-03-21', completionRate: 76 }
  ],
  taskDistribution: [
    { name: 'Completed', value: 98 },
    { name: 'In Progress', value: 45 },
    { name: 'Pending', value: 13 }
  ],
  userActivity: [
    { date: '2024-03-15', tasks: 12, completed: 8 },
    { date: '2024-03-16', tasks: 15, completed: 11 },
    { date: '2024-03-17', tasks: 10, completed: 7 },
    { date: '2024-03-18', tasks: 18, completed: 13 },
    { date: '2024-03-19', tasks: 14, completed: 9 },
    { date: '2024-03-20', tasks: 16, completed: 12 },
    { date: '2024-03-21', tasks: 13, completed: 10 }
  ]
};