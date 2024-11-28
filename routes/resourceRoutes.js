// routes/resourceRoutes.js
const express = require('express');
const { 
  createResource, 
  getAllResources, 
  getResourceById, 
  updateResource, 
  deleteResource 
} = require('../controllers/resourceController');
const { authMiddleware} = require('../middleware/authMiddleware');
const {rbacMiddleware} = require('../middleware/rbacMiddleware');
const router = express.Router();

router.post('/', 
  authMiddleware, 
  rbacMiddleware(['CREATE_RESOURCE','MANAGE_RESOURCES']), 
  createResource
);

router.get('/', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL','MANAGE_RESOURCES']), 
  getAllResources
);

router.get('/:id', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL','MANAGE_RESOURCES']), 
  getResourceById
);

router.put('/:id', 
  authMiddleware, 
  rbacMiddleware(['UPDATE_RESOURCE','MANAGE_RESOURCES']), 
  updateResource
);

router.delete('/:id', 
  authMiddleware, 
  rbacMiddleware(['DELETE_RESOURCE','MANAGE_RESOURCES']), 
  deleteResource
);

module.exports = router;