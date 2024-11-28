# Role-Based Access Control (RBAC) System


### 🌐 Overview
The Role-Based Access Control (RBAC) system is a sophisticated authorization mechanism designed to enhance application security and streamline user access management. By implementing a hierarchical role structure, the system provides granular control over user permissions, ensuring that individuals can only access resources and perform actions appropriate to their organizational responsibilities. The RBAC system offers a scalable and flexible solution that can adapt to complex organizational structures, supporting dynamic role assignments and comprehensive access control across different levels of the application ecosystem.

### 🏗️ Role Structure

#### Role Model
The Role model defines the following key attributes:
- `name`: Unique identifier for the role (e.g., SUPER_ADMIN, ADMIN, MANAGER, USER)
- `roleValue`: Numeric value representing the role hierarchy
- `permissions`: Array of specific access permissions
- `description`: Detailed explanation of the role's purpose
- `isDefault`: Indicates if the role is the default system role

#### Predefined Roles
The system comes with four default roles:
1. **SUPER_ADMIN** (Role Value: 1)
   - Full system access
   - Permissions: 
     * User management (create, update, delete)
     * Resource management (create, update, delete)
     * Read all system data
     * Manage roles

2. **ADMIN** (Role Value: 2)
   - Extensive system permissions
   - Permissions:
     * User management (create, update)
     * Resource management (create, update)
     * Read all system data

3. **MANAGER** (Role Value: 3)
   - Limited management capabilities
   - Permissions:
     * Resource management (create, update)
     * Read all system data

4. **USER** (Role Value: 4)
   - Minimal permissions
   - Default role for new users
   - No specific permissions by default

### 🔐 Permissions

Available Permissions:
- `CREATE_USER`: Ability to create new user accounts
- `UPDATE_USER`: Ability to modify user account details
- `DELETE_USER`: Ability to remove user accounts
- `CREATE_RESOURCE`: Ability to create new resources
- `UPDATE_RESOURCE`: Ability to modify existing resources
- `DELETE_RESOURCE`: Ability to delete resources
- `READ_ALL`: Access to view all system data
- `MANAGE_ROLES`: Ability to create, update, and delete roles

## 🔧 Environment Setup
### Create Environment File
Create a `.env` file in the root directory with the following configurations:
### MongoDB Connection
MONGODB_URI=mongodb+srv://db_username:<db_password>@cluster0.sxzx4.mongodb.net/
### JWT Configuration
- JWT_SECRET=`your_jwt_secret_key`
- JWT_EXPIRATION=1h

### Port Configuration
PORT=3000


### Environment Variables

- `MONGODB_URI`: Connection string for your MongoDB database
- `JWT_SECRET`: Secret key for JSON Web Token authentication
- `PORT`: Port number for the server
- `JWT_EXPIRATION`: The expiration time of the JWT

### 🚀 Installation

To get started with RABC System, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/evil-queen28/RABC_System.git
   ```

2. Navigate to the project directory:
   ```bash
   cd RABC_System
   ```


3. Install the required dependencies:
   ```bash
   npm install
   ```


4. To run the application locally, use the following command:
   ```bash
   node app.js
   ```
## 📦 Postman Collection Usage

1. Open Postman
2. Click on "Import" in the top left corner
3. Select the `role-permission-test-collection (1).json` file from the root directory
### Authentication

1. Obtain a JWT token by logging in
2. Add the token to the Authorization header for protected routes

- Header Key: `Authorization`
- Header Value: `Bearer your_jwt_token`
