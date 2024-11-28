const rbacMiddleware = (requiredPermissions) => {
    return (req, res, next) => {
      const userRole = req.user.role;
  
      // Super Admin always has full access
      if (userRole.name === 'SUPER_ADMIN') {
        return next();
      }
  
      // Explicitly prevent certain actions for lower roles
      const preventedPermissions = {
        'ADMIN': ['MANAGE_ROLES'], // Admins cannot manage roles
        'MANAGER': ['MANAGE_ROLES', 'DELETE_USER', 'CREATE_USER', 'UPDATE_USER'], // Managers have even more restrictions
        'USER': ['MANAGE_ROLES', 'DELETE_USER', 'CREATE_USER', 'UPDATE_USER', 'CREATE_RESOURCE', 'UPDATE_RESOURCE', 'DELETE_RESOURCE'] // Users have minimal permissions
      };
  
      // Check if any prevented permissions are in the required permissions
      const hasPreventedPermission = preventedPermissions[userRole.name]?.some(
        preventedPerm => requiredPermissions.includes(preventedPerm)
      );
  
      if (hasPreventedPermission) {
        return res.status(403).json({ 
          message: 'Access denied: Insufficient permissions',
          requiredPermissions,
          userPermissions: userRole.permissions
        });
      }
  
      // Check if user has the required permissions
      const hasPermission = requiredPermissions.some(
        permission => userRole.permissions.includes(permission)
      );
  
      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Access denied: Insufficient permissions',
          requiredPermissions,
          userPermissions: userRole.permissions
        });
      }
  
      next();
    };
  };
  module.exports = { rbacMiddleware };