const TaskList = ({ tasks, onDelete }) => {
  if (!Array.isArray(tasks)) {
    console.error('Tasks is not an array:', tasks);
    return null; // or display a fallback UI
  }

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          {onDelete && <button onClick={() => onDelete(task.id)}>Delete</button>}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;