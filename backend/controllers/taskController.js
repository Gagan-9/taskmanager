const Task = require('../models/Task');

const taskController = {
  async createTask(req, res) {
    try {
      const task = await Task.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTasksByUserId(req, res) {
    try {
      const tasks = await Task.findByUserId(req.params.userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    async getAllTasks(req, res) {
      try {
        const tasks = await Task.findAll();
        res.json(tasks); // Ensure this is an array
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  
  async updateTask(req, res) {
    try {
      const task = await Task.update(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTask(req, res) {
    try {
      await Task.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = taskController;