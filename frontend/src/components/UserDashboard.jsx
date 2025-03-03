import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Fetch the logged-in user's ID

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/user/${userId}`, { headers });
        console.log('Tasks response:', response.data); // Log the response

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setError('Invalid response from the server');
        }
      } catch (error) {
        setError('Error fetching tasks: ' + (error.response?.data?.message || error.message));
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return (
    <div>
      <h1>User Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;