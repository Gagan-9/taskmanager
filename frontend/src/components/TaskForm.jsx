import { useState } from 'react';
import axios from 'axios';
const TaskForm = ({ users, setTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        { title, description, assignedTo },
        { headers }
      );

      console.log('Task created:', response.data); // Log the created task
      setTasks(prevTasks => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">Assign to</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
