import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth for logout
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { logout } = useAuth(); // Use logout from AuthContext

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers });
        const tasksResponse = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, { headers });

        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, { headers });
      setUsers(users.filter(user => user.id !== id)); // Update state
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Find the existing user to retain the email
      const existingUser = users.find(user => user.id === id);
      if (!existingUser) {
        console.error('User not found');
        return;
      }
  
      // Ask for new username and role
      const newUsername = prompt("Enter new username:", existingUser.username);
      const newRole = prompt("Enter new role (admin/user):", existingUser.role);
  
      if (!newUsername || !newRole) {
        alert("Username and Role are required!");
        return;
      }
  
      // Create updated user object
      const updatedUserData = {
        username: newUsername,
        role: newRole,
        email: existingUser.email // Retain the original email
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        updatedUserData,
        { headers }
      );
  
      console.log('Updated user response:', response.data);
  
      // Update state with new user data
      setUsers(users.map(user => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`, { headers });
      setTasks(tasks.filter(task => task.id !== id)); // Update state
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        updatedTask,
        { headers }
      );

      setTasks(tasks.map(task => (task.id === id ? response.data : task))); // Update state
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <TaskForm users={users} setTasks={setTasks} />
      <TaskList tasks={tasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            <button onClick={() => handleUpdateUser(user.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
