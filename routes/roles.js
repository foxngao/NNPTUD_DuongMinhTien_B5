var express = require('express');
var router = express.Router();
var Role = require('../models/Role');

// GET /roles - Get all roles (not soft-deleted)
router.get('/', async function (req, res, next) {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (err) {
    next(err);
  }
});

// GET /roles/:id - Get role by ID
router.get('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// POST /roles - Create new role
router.post('/', async function (req, res, next) {
  try {
    const role = new Role(req.body);
    const savedRole = await role.save();
    res.status(201).json(savedRole);
  } catch (err) {
    next(err);
  }
});

// PUT /roles/:id - Update role
router.put('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// DELETE /roles/:id - Soft delete role
router.delete('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
