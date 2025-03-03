const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (username, email, password, role) are required' });
    }

    try {
      console.log('Registering user:', { username, email, role }); // Log the input

      // Check if the user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Create the user
      const user = await User.create({ username, email, password, role });
      console.log('User registered successfully:', user); // Log the created user

      res.status(201).json(user);
    } catch (error) {
      console.error('Registration error:', error); // Log the error
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      console.log('Login attempt for email:', email); // Log the email

      // Find the user by email
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('User not found for email:', email); // Log if user not found
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid credentials for email:', email); // Log if password doesn't match
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Prepare the response
      const response = {
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
      };

      console.log('Login successful for email:', email); // Log successful login
      console.log('Login API Response:', response); // Log the response

      res.json(response);
    } catch (error) {
      console.error('Login error:', error); // Log the error
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;