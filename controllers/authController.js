// controllers/authController.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Add this import
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { registerValidation, loginValidation } = require('../utils/validationUtils');
const Role = require('../models/Role');

exports.register = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      // If no role is provided, get the default USER role
      let selectedRole;
      if (!role) {
        selectedRole = await Role.findOne({ name: 'USER', isDefault: true });
      } else {
        // Find role by roleValue or name
        selectedRole = await Role.findOne({ 
          $or: [
            { roleValue: role },
            { name: role }
          ]
        });
      }
  
      if (!selectedRole) {
        return res.status(400).json({ 
          message: 'Invalid role', 
          details: 'No role found with the provided value or name' 
        });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await hashPassword(password);
  
      // Create a new user with the selected role's _id
      const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword, 
        role: selectedRole._id 
      });
      
      await newUser.save();
  
      // Generate and return a JWT token
      const token = generateToken({ userId: newUser._id });
      return res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
      console.error('Detailed Registration Error:', error);
      return res.status(500).json({ 
        message: 'Error creating user', 
        error: error.toString() 
      });
    }
  };
// Login a user
exports.login = async (req, res) => {
try {
// Validate request data
const { error } = loginValidation.validate(req.body);
if (error) {
return res.status(400).json({ message: error.details[0].message });
}
const { email, password } = req.body;

// Find the user by email
const user = await User.findOne({ email }).populate('role');
if (!user) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

// Compare the password
const isMatch = await comparePassword(password, user.password);
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

// Generate and return a JWT token
const token = generateToken({ userId: user._id });
return res.json({ token });
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error logging in' });
}
};
// Logout a user
exports.logout = (req, res) => {
// For this simple example, we'll just return a success message
// In a production application, you might want to implement token revocation or blacklisting
return res.json({ message: 'Logged out successfully' });
};
// Get the currently logged-in user
// controllers/authController.js

exports.getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate('role', 'name permissions');
      return res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error getting current user' });
    }
  };

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  };