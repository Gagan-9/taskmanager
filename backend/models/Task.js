const pool = require('../config/db');

const Task = {
  async create({ title, description, assignedTo }) {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description, assigned_to) VALUES ($1, $2, $3) RETURNING *',
      [title, description, assignedTo]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE assigned_to = $1', [userId]);
    return rows;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM tasks');
    return rows;
  },

  async update(id, { title, description, assignedTo }) {
    const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, assigned_to = $3 WHERE id = $4 RETURNING *',
      [title, description, assignedTo, id]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  },
};

module.exports = Task;