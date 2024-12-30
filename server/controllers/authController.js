const User = require('../models/user');
const Task = require('../models/task');
const { hashpassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash password
        const hashedPassword = await hashpassword(password);
        
        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user' // Default to 'user' if role not specified
        });

        // Generate token for automatic login after registration
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return user data (excluding password)
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

       
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return user data (excluding password)
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
};

const getAllUsers = async (req, res) => {
    try {
        // Get all users (excluding passwords)
        const users = await User.find().select('-password');
        
        // Get all tasks
        const tasks = await Task.find();
        
        // Calculate task statistics for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const userTasks = tasks.filter(task => task.userId?.toString() === user._id.toString());
            const totalTasks = userTasks.length;
            const completedTasks = userTasks.filter(task => task.status === 'completed').length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                taskCount: totalTasks,
                completedTasks: completedTasks,
                completionRate: completionRate
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logout,
    getAllUsers
};