const Task = require('../models/task');
const User = require('../models/user');

const createTask = async (req, res) => {
    try {
      console.log('Request body:', req.body);
     
      const {  userId ,title, description, dueDate } = req.body;
     
      const newTask = new Task({
        userId,
        title,
        description,
        dueDate,
       
      });
      console.log('New task:', newTask);
      await newTask.save();
      const populatedTask = await Task.findById(newTask._id).populate('userId', 'name email');
      res.status(201).json(populatedTask);
      console.log('Task created successfully');
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
      console.error('Error creating task:', error);
    }
};

const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const getTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id).populate('userId', 'name email');
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
};

const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
        new: true, // Return the updated document
      }).populate('userId', 'name email');
      console.log('Update task ID:', id);
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
};

const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
