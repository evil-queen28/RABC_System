const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER']
  },
  roleValue: {
    type: Number,
    required: true,
    unique: true,
    enum: [1, 2, 3, 4]
  },
  permissions: {
    type: [String],
    enum: [
      'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 
      'CREATE_RESOURCE', 'UPDATE_RESOURCE', 'DELETE_RESOURCE',
      'READ_ALL', 'MANAGE_ROLES'
    ],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save hook to ensure only one default role
RoleSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.model('Role').updateMany({ isDefault: true }, { isDefault: false });
  }
  next();
});

// Static method to seed roles
RoleSchema.statics.seedRoles = async function() {
  try {
    // Check if roles already exist
    const existingRolesCount = await this.countDocuments();
    if (existingRolesCount > 0) {
      console.log('Roles already seeded. Skipping seeding.');
      return;
    }

    // Define roles with permissions
    const roles = [
      {
        name: 'SUPER_ADMIN',
        roleValue: 1,
        permissions: [
          'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 
          'CREATE_RESOURCE', 'UPDATE_RESOURCE', 'DELETE_RESOURCE',
          'READ_ALL', 'MANAGE_ROLES'
        ],
        description: 'Super Administrator with full system access',
        isDefault: false
      },
      {
        name: 'ADMIN',
        roleValue: 2,
        permissions: [
          'CREATE_USER', 'UPDATE_USER', 
          'CREATE_RESOURCE', 'UPDATE_RESOURCE',
          'READ_ALL'
        ],
        description: 'Administrator with extensive system permissions',
        isDefault: false
      },
      {
        name: 'MANAGER',
        roleValue: 3,
        permissions: [
          'CREATE_RESOURCE', 'UPDATE_RESOURCE',
          'READ_ALL'
        ],
        description: 'Manager with resource management permissions',
        isDefault: false
      },
      {
        name: 'USER',
        roleValue: 4,
        permissions: [],
        description: 'Default user role with minimal permissions',
        isDefault: true
      }
    ];

    // Insert roles
    await this.insertMany(roles);
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

// Static method to get default role
RoleSchema.statics.getDefaultRole = async function() {
  let defaultRole = await this.findOne({ isDefault: true });
  
  if (!defaultRole) {
    // If no default role exists, create a default 'USER' role
    defaultRole = await this.create({
      name: 'USER',
      roleValue: 4,
      permissions: [],
      isDefault: true,
      description: 'Default user role with minimal permissions'
    });
  }
  
  return defaultRole;
};

const Role = mongoose.model('Role', RoleSchema);

// Export the seeding method to be called during app initialization
module.exports = Role;