// routes/userRoutes.js
const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { authMiddleware} = require('../middleware/authMiddleware');
const {rbacMiddleware} = require('../middleware/rbacMiddleware');
const router = express.Router();

router.get('/', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL']), 
  getAllUsers
);

router.get('/:id', 
  authMiddleware, 
  rbacMiddleware(['READ_ALL']), 
  getUserById
);

router.put('/:id', 
  authMiddleware, 
  rbacMiddleware(['UPDATE_USER']), 
  updateUser
);

router.delete('/:id', 
  authMiddleware, 
  rbacMiddleware(['DELETE_USER']), 
  deleteUser
);

module.exports = router;
