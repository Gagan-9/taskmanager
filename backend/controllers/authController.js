const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    const { username, email, password, role } = req.body;
    try {
      console.log('Registering user:', { username, email, role }); // Log the input
      const user = await User.create({ username, email, password, role });
      res.status(201).json(user);
    } catch (error) {
      console.error('Registration error:', error); // Log the error
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      const response = { 
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role } 
      };
  
      console.log("Login API Response:", response); // ✅ Debugging log
      res.json(response);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
};

module.exports = authController;