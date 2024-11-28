// routes/roleRoutes.js
const express = require('express');
const { 
  createRole, 
  getAllRoles, 
  getRoleById, 
  updateRole, 
  deleteRole 
} = require('../controllers/roleController');
const { authMiddleware} = require('../middleware/authMiddleware');
const {rbacMiddleware} = require('../middleware/rbacMiddleware');
const router = express.Router();

router.post('/', 
  authMiddleware, 
  rbacMiddleware(['MANAGE_ROLES']), 
  createRole
);

router.get('/', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL']), 
  getAllRoles
);

router.get('/:id', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL']), 
  getRoleById
);

router.put('/:id', 
  authMiddleware, 
  rbacMiddleware(['MANAGE_ROLES']), 
  updateRole
);

router.delete('/:id', 
  authMiddleware, 
  rbacMiddleware(['MANAGE_ROLES']), 
  deleteRole
);

module.exports = router;