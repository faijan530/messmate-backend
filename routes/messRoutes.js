const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Mess = require('../models/Mess');

/* ================= GET ALL + FILTER ================= */
router.get('/', async (req, res) => {
  try {
    const whereClause = {};

    if (req.query.location) {
      whereClause.location = req.query.location;
    }

    if (req.query.minPrice) {
      whereClause.price = { [Op.gte]: parseInt(req.query.minPrice) };
    }

    const messes = await Mess.findAll({ where: whereClause });
    res.json(messes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* ================= CREATE ================= */
router.post('/', async (req, res) => {
  try {
    const mess = await Mess.create(req.body);
    res.status(201).json(mess);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



/* ================= GET BY ID ================= */
router.get('/:id', async (req, res) => {
  try {
    const mess = await Mess.findByPk(req.params.id);
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }
    res.json(mess);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
});

/* ================= UPDATE ================= */
router.put('/:id', async (req, res) => {
  try {
    const mess = await Mess.findByPk(req.params.id);
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    await mess.update(req.body);
    res.json({ message: 'Mess updated successfully', mess });

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
/* ================= DELETE ================= */
router.delete('/:id', async (req, res) => {
  try {
    const mess = await Mess.findByPk(req.params.id);
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    await mess.destroy();
    res.json({ message: 'Mess deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;
