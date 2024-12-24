import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import axios from 'axios';
import { UserContext, UserContextProvider } from './context/userContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/api';

function App() {
  return (
    <UserContextProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/user-dashboard" replace />} />
          <Route
            path="user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
