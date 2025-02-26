import { useState } from 'react';

const TaskForm = ({ users, selectedUser, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(selectedUser || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) {
      alert('Please fill all fields');
      return;
    }

    const taskData = { title, description, assignedTo };
    onCreateTask(taskData);

    // Reset form
    setTitle('');
    setDescription('');
    setAssignedTo('');
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
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
      >
        <option value="">Assign to</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;