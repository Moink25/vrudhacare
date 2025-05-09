# VrudhaCare eCommerce Platform

VrudhaCare is an eCommerce platform for an old age home, selling handmade products crafted by senior residents and accepting donations to support their well-being.

## Setup Instructions

### 1. Environment Variables Setup

#### Client (.env file in client directory)

Create a `.env` file in the client directory with the following variables:

```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyhere
```

#### Server (.env file in server directory)

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/vrudhacare
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_yourkeyhere
RAZORPAY_KEY_SECRET=yoursecrethere
```

### 2. MongoDB Atlas Setup

1. Sign up/login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Build a new cluster (free tier is sufficient)
4. Once your cluster is created, click on "Connect"
5. Choose "Connect your application"
6. Copy the connection string and replace the placeholders in the `.env` file:
   - Replace `yourusername` and `yourpassword` with your database username and password
   - Replace `cluster0.mongodb.net` with your actual cluster address

### 3. Seeding the Database with Products

To populate the database with product data, run the following commands:

```bash
cd server
node seeds/productSeeder.js
```

This will add 20 handmade products with descriptions, images, and other details to your database.

### 4. Starting the Application

#### Client

```bash
cd client
npm install
npm run dev
```

#### Server

```bash
cd server
npm install
npm run dev
```

## Features

- Customer-facing features: Home page, product listings, cart functionality, checkout with payment options
- Admin panel with route protection for managing products, orders, donations, and users
- Chatbot for customer queries
- Donation page with Razorpay integration

## Tech Stack

- MongoDB Atlas - Database
- Express - Backend framework
- React - Frontend library
- Node.js - Runtime environment
- Tailwind CSS - Styling
- Razorpay - Payment gateway integration
#   v r u d h a c a r e  
 