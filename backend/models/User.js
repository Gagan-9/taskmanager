const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
 async create({ username, email, password, role }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { rows } = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, hashedPassword, role]
      );
      return rows[0];
    } catch (error) {
      console.error('User creation error:', error); 
      throw error;
    }
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  },

  async update(id, { username, email, role }) {
    const { rows } = await pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [username, email, role, id]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

module.exports = User;