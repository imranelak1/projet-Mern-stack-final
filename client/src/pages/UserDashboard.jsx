import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../context/userContext';
import { api } from '../services/mockApi';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTrash, FaClock, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';

const UserDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const { user, loading } = useContext(UserContext);

  // Fetch tasks
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      api
        .getTasks(user.id)
        .then((data) => setTasks(data))
        .catch(() => toast.error('Failed to fetch tasks'))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // Create a new task
  const createTask = (newTask) => {
    if (loading) return;

    if (user && user.id) {
      api.createTask({ ...newTask, userId: user.id })
        .then((createdTask) => {
          setTasks((prevTasks) => [...prevTasks, createdTask]);
          toast.success('Task created successfully');
          reset();
        })
        .catch((error) => {
          console.error('Create task error:', error);
          toast.error('Failed to create task');
        });
    } else {
      toast.error('User is not logged in');
    }
  };

  // Update a task's status
  const updateTask = (id, status) => {
    api
      .updateTask(id, { status })
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => 
            task._id === id ? { ...task, status: updatedTask.status } : task
          )
        );
        toast.success('Task updated successfully');
      })
      .catch(() => toast.error('Failed to update task'));
  };

  // Delete a task
  const deleteTask = (id) => {
    api
      .deleteTask(id)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        toast.success('Task deleted successfully');
      })
      .catch(() => toast.error('Failed to delete task'));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });

  // Handle form submission
  const onSubmit = (data) => {
    createTask({ ...data, status: 'pending' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('title', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task title"
            />
          </div>
          <div>
            <textarea
              {...register('description')}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task description"
              rows="3"
            />
          </div>
          <div>
            <input
              type="date"
              {...register('dueDate', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <div className="space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded transition duration-150 ease-in-out ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded transition duration-150 ease-in-out ${
                filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded transition duration-150 ease-in-out ${
                filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div 
              key={task._id} 
              className="border rounded-lg p-4 hover:shadow-md transition duration-150 ease-in-out"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      {task.userId?.name || 'Unknown User'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => updateTask(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                    className={`p-2 rounded hover:bg-gray-100 transition duration-150 ease-in-out ${
                      task.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                    }`}
                    title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-2 text-red-600 rounded hover:bg-red-50 transition duration-150 ease-in-out"
                    title="Delete task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
