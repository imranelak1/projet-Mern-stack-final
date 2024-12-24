const Task = require('../models/task');
const User = require('../models/user');

const getAnalytics = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));

        // Get all users and their tasks
        const users = await User.find().select('-password');
        const tasks = await Task.find({
            createdAt: { $gte: dateLimit }
        }).populate('userId', 'name');

        // Calculate task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Calculate user statistics
        const totalUsers = users.length;
        const activeUsers = new Set(tasks.map(task => task.userId?._id.toString())).size;

        // Calculate task distribution per user
        const tasksByUser = users.map(user => {
            const userTasks = tasks.filter(task => task.userId?._id.toString() === user._id.toString());
            const userCompletedTasks = userTasks.filter(task => task.status === 'completed').length;
            const userTotalTasks = userTasks.length;
            const userCompletionRate = userTotalTasks > 0 ? (userCompletedTasks / userTotalTasks) * 100 : 0;

            return {
                userId: user._id,
                name: user.name,
                totalTasks: userTotalTasks,
                completedTasks: userCompletedTasks,
                pendingTasks: userTotalTasks - userCompletedTasks,
                completionRate: Math.round(userCompletionRate)
            };
        });

        // Calculate daily task activity
        const dailyActivity = [];
        for (let i = 0; i < parseInt(days); i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayTasks = tasks.filter(task => 
                new Date(task.createdAt) >= date && new Date(task.createdAt) < nextDate
            );
            
            const dayCompleted = dayTasks.filter(task => task.status === 'completed').length;
            const dayTotal = dayTasks.length;

            dailyActivity.unshift({
                date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
                tasks: dayTotal,
                completed: dayCompleted
            });
        }

        // Prepare response
        const analytics = {
            summary: [
                {
                    label: 'Total Tasks',
                    value: totalTasks,
                    change: 0,
                    type: 'total'
                },
                {
                    label: 'Completed Tasks',
                    value: completedTasks,
                    change: 0,
                    type: 'completed'
                },
                {
                    label: 'Completion Rate',
                    value: Math.round(completionRate) + '%',
                    change: 0,
                    type: 'rate'
                },
                {
                    label: 'Active Users',
                    value: activeUsers,
                    change: 0,
                    type: 'users'
                }
            ],
            taskCompletionRate: dailyActivity,
            taskDistribution: tasksByUser,
            userActivity: dailyActivity // Using the same daily activity data
        };

        res.json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

module.exports = {
    getAnalytics
};
