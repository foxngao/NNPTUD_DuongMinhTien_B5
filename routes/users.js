var express = require('express');
var router = express.Router();
var User = require('../models/User');

// GET /users - Get all users (not soft-deleted)
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /users - Create new user
router.post('/', async function (req, res, next) {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

// PUT /users/:id - Update user
router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /users/:id - Soft delete user (xoá mềm)
router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /users/enable - Enable user (set status to true)
// Truyền lên email và username, nếu thông tin đúng thì chuyển status về true
router.post('/enable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }

    user.status = true;
    await user.save();
    res.json({ message: 'User enabled successfully', user });
  } catch (err) {
    next(err);
  }
});

// POST /users/disable - Disable user (set status to false)
// Truyền lên email và username, nếu thông tin đúng thì chuyển status về false
router.post('/disable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and username' });
    }

    user.status = false;
    await user.save();
    res.json({ message: 'User disabled successfully', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
