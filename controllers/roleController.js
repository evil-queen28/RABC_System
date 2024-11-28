// controllers/roleController.js
const Role = require('../models/Role');
const mongoose = require('mongoose');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { 
      name, 
      roleValue, 
      permissions, 
      description,
      isDefault 
    } = req.body;

    // Check if role with same name or value already exists
    const existingRole = await Role.findOne({
      $or: [
        { name },
        {roleValue}
        
      ]
    });

    if (existingRole) {
      return res.status(400).json({ 
        message: 'Role with this name or value already exists' 
      });
    }

    const newRole = new Role({
      name,
      roleValue,
      permissions: permissions || [],
      description: description || '',
      isDefault: isDefault || false
    });

    await newRole.save();

    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Role Creation Error:', error);
    return res.status(500).json({ 
      message: 'Error creating role', 
      error: error.message 
    });
  }
};

// Update an existing role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      roleValue, 
      permissions, 
      description,
      isDefault 
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Update role fields
    if (name) role.name = name;
    if (roleValue) role.roleValue = roleValue;
    if (permissions) role.permissions = permissions;
    if (description) role.description = description;
    if (isDefault !== undefined) role.isDefault = isDefault;

    await role.save();

    return res.status(200).json(role);
  } catch (error) {
    console.error('Role Update Error:', error);
    return res.status(500).json({ 
      message: 'Error updating role', 
      error: error.message 
    });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }

    // Prevent deletion of default role
    const role = await Role.findById(id);
    if (role.isDefault) {
      return res.status(400).json({ 
        message: 'Cannot delete the default role' 
      });
    }

    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    return res.status(200).json({ 
      message: 'Role deleted successfully',
      deletedRole 
    });
  } catch (error) {
    console.error('Role Deletion Error:', error);
    return res.status(500).json({ 
      message: 'Error deleting role', 
      error: error.message 
    });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error('Get Roles Error:', error);
    return res.status(500).json({ 
      message: 'Error fetching roles', 
      error: error.message 
    });
  }
};

// Get a specific role
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error('Get Role by ID Error:', error);
    return res.status(500).json({ 
      message: 'Error fetching role', 
      error: error.message 
    });
  }
};