import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './TaskList';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/tasks/user/1'); // Replace with dynamic user ID
      setTasks(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default UserDashboard;