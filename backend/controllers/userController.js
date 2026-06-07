const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/usermodels');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const userExists = await User.findByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateJWTtoken(user.id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateJWTtoken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

const generateJWTtoken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });

module.exports = { registerUser, loginUser, getCurrentUser, getAllUsers };
