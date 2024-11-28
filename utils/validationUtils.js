// utils/validationUtils.js
const Joi = require('joi');

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional()
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resourceValidation = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  type: Joi.string().valid('DOCUMENT', 'PROJECT', 'TASK', 'MISC').required(),
  status: Joi.string().valid('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED').optional(),
  assignedTo: Joi.array().items(Joi.string()).optional(), // Allow array of user IDs
  accessibleRoles: Joi.array().items(Joi.string()).optional() // Allow array of role IDs
});

module.exports = {
  registerValidation,
  loginValidation,
  resourceValidation
};