// controllers/resourceController.js
const Resource = require('../models/Resource');
const { resourceValidation } = require('../utils/validationUtils');
// Create a new resource
exports.createResource = async (req, res) => {
try {
// Validate request data
const { error } = resourceValidation.validate(req.body);
if (error) {
return res.status(400).json({ message: error.details[0].message });
}
const { title, description, type, status, assignedTo, accessibleRoles } = req.body;
//
// Create a new resource
const newResource = new Resource({
  title,
  description,
  type,
  status: status || 'DRAFT',
  createdBy: req.user.id,
  assignedTo,
  accessibleRoles
});

await newResource.save();
return res.status(201).json(newResource);
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error creating resource' });
}
};
// Get all resources
exports.getAllResources = async (req, res) => {
try {
const resources = await Resource.find()
.populate('createdBy', 'username')
.populate('assignedTo', 'username')
.populate('accessibleRoles', 'name');
return res.json(resources);
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error getting resources' });
}
};
// Get a resource by ID
exports.getResourceById = async (req, res) => {
try {
const resource = await Resource.findById(req.params.id)
.populate('createdBy', 'username')
.populate('assignedTo', 'username')
.populate('accessibleRoles', 'name');
if (!resource) {
return res.status(404).json({ message: 'Resource not found' });
}
return res.json(resource);
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error getting resource' });
}
};
// Update a resource
exports.updateResource = async (req, res) => {
try {
// Validate request data
const { error } = resourceValidation.validate(req.body);
if (error) {
return res.status(400).json({ message: error.details[0].message });
}
const { title, description, type, status, assignedTo, accessibleRoles } = req.body;

// Find the resource and update it
const resource = await Resource.findByIdAndUpdate(
  req.params.id,
  { title, description, type, status, assignedTo, accessibleRoles },
  { new: true }
).populate('createdBy', 'username')
 .populate('assignedTo', 'username')
 .populate('accessibleRoles', 'name');

if (!resource) {
  return res.status(404).json({ message: 'Resource not found' });
}

return res.json(resource);
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error updating resource' });
}
};
// Delete a resource
exports.deleteResource = async (req, res) => {
try {
const resource = await Resource.findByIdAndDelete(req.params.id);
if (!resource) {
return res.status(404).json({ message: 'Resource not found' });
}
return res.json({ message: 'Resource deleted' });
} catch (error) {
console.error(error);
return res.status(500).json({ message: 'Error deleting resource' });
}
};