# VrudhaCare Admin Panel Guide

This guide explains how to access and use the admin panel for the VrudhaCare eCommerce platform.

## Setting Up an Admin User

To access the admin panel, you need an account with admin privileges. Here's how to create one:

### Option 1: Using the Create Admin Script

1. Make sure your server is running
2. Open a terminal in the project root directory
3. Run the following command:
   ```
   npm run create-admin
   ```
4. Follow the prompts to enter admin name, email, and password
5. Once successful, you can use these credentials to log in

### Option 2: Manually Create an Admin User

If you prefer to create an admin user using the API directly:

```
POST /api/users/create-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

## Accessing the Admin Panel

1. Go to the login page (`/login`)
2. Click the "Customer Login" button at the top right to switch to "Admin Login"
3. Enter your admin credentials (email and password)
4. Click "Admin Sign in"
5. You'll be redirected to the admin dashboard

You can also access the admin panel directly by going to `/admin` after logging in as an admin.

## Admin Features

As an admin, you can:

1. **View Dashboard**

   - See overall statistics
   - View recent orders and users

2. **Manage Products**

   - Add new products
   - Edit existing products
   - Delete products
   - Add product images

3. **Manage Orders**

   - View all orders
   - Update order status
   - View order details

4. **Manage Users**

   - View all users
   - View user details

5. **Manage Donations**
   - View all donations
   - Track donation status

## Security Notes

- Never share your admin credentials
- Always log out when you're done
- Admin accounts have full access to all system functionality
- The system logs all admin actions
