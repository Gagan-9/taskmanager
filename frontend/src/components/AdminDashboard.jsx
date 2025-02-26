import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching users...');
        const usersResponse = await axios.get('/api/users');
        console.log('Users fetched:', usersResponse.data);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);

        console.log('Fetching tasks...');
        const tasksResponse = await axios.get('/api/tasks');
        console.log('Tasks fetched:', tasksResponse.data);
        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Check console for details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      console.log(`Deleting user with ID: ${id}`);
      await axios.delete(`/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      console.log(`User with ID: ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      console.log(`Deleting task with ID: ${id}`);
      await axios.delete(`/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
      console.log(`Task with ID: ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <TaskForm users={users} setTasks={setTasks} />
      <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;