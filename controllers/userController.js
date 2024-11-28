// controllers/userController.js
const User = require('../models/User');
const Role = require('../models/Role');
const mongoose = require('mongoose');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
      .populate('role', 'name roleValue');
    return res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({ message: 'Error getting users', error: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id, { password: 0 })
      .populate('role', 'name roleValue');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Get User by ID Error:', error);
    return res.status(500).json({ message: 'Error getting user', error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      avatar, 
      isActive, 
      role, 
      email 
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the existing user
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update object
    const updateData = { 
      profile: { 
        firstName: firstName || existingUser.profile.firstName, 
        lastName: lastName || existingUser.profile.lastName, 
        avatar: avatar || existingUser.profile.avatar 
      }
    };

    // Handle role update with validation
    if (role) {
      // Validate that the role exists
      const existingRole = await Role.findById(role);
      if (!existingRole) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      updateData.role = role;
    }

    // Handle email update with unique check
    if (email) {
      // Check if email is already in use by another user
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updateData.email = email;
    }

    // Update isActive status if provided
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).populate('role', 'name roleValue');

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.json(userResponse);
  } catch (error) {
    console.error('Update User Error:', error);

    // Handle unique constraint errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        field: Object.keys(error.keyPattern)[0] 
      });
    }

    return res.status(500).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent deleting the last admin or super admin
    const userToDelete = await User.findById(id).populate('role');
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting last admin or super admin
    const adminRoles = ['SUPER_ADMIN', 'ADMIN'];
    if (adminRoles.includes(userToDelete.role.name)) {
      const adminUserCount = await User.countDocuments({
        'role.name': { $in: adminRoles }
      });

      if (adminUserCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last admin user as there is only one admin' 
        });
      }
    }

    // Perform deletion
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        username: deletedUser.username
      }
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};