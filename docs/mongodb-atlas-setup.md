# MongoDB Atlas Setup Guide

This guide walks you through setting up MongoDB Atlas for the VrudhaCare application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you already have one)

## Step 2: Create a New Project

1. After logging in, click on "Projects" in the top navigation
2. Click "New Project"
3. Enter a name for your project (e.g., "VrudhaCare")
4. Click "Create Project"

## Step 3: Create a Cluster

1. Click "Build a Database"
2. Choose the free tier option (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure) and region
   - Choose a region closest to your target users for better performance
4. Name your cluster (default name is "Cluster0")
5. Click "Create Cluster"

## Step 4: Set Up Database Access

1. While your cluster is being created, click on "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" for authentication method
4. Enter a username and password
   - **Important:** Save these credentials securely; you'll need them for your application
5. Select "Read and write to any database" for user privileges
6. Click "Add User"

## Step 5: Configure Network Access

1. Click on "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, you can allow access from anywhere by selecting "Allow Access from Anywhere"
   - For production, limit access to specific IP addresses
4. Click "Confirm"

## Step 6: Connect to Your Cluster

1. Return to the "Database Deployments" page and click "Connect" on your cluster
2. Select "Connect your application"
3. Choose "Node.js" and the latest version
4. Copy the connection string
5. Replace `<password>` with your database user's password
6. Replace `<dbname>` with "vrudhacare"

## Step 7: Add Connection String to Environment Variables

Add the connection string to your server's `.env` file:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/vrudhacare
```

## Step 8: Seed the Database

After setting up your connection, populate the database with initial data:

```bash
cd server
node seeds/productSeeder.js
```

## Database Structure

VrudhaCare uses the following collections:

1. **users** - User accounts and authentication
2. **products** - Handcrafted products for sale
3. **orders** - User purchase records
4. **donations** - Donation records

## MongoDB Atlas Dashboard Features

Take advantage of these MongoDB Atlas features:

1. **Performance Advisor** - Get index suggestions for better query performance
2. **Data Explorer** - View and edit your data through the Atlas UI
3. **Charts** - Create visual representations of your data
4. **Alerts** - Set up notifications for specific database events
5. **Backup** - Scheduled snapshots of your data

## Monitoring Your Database

1. Click on your cluster and then the "Metrics" tab
2. Here you can monitor:
   - Operations (reads/writes)
   - Connections
   - Network traffic
   - Disk usage

## Best Practices

1. **Indexing** - Create indexes for frequently queried fields
2. **Regular Backups** - Set up automated backups for your database
3. **Connection Pooling** - Use MongoDB's connection pooling for better performance
4. **Security** - Regularly rotate database user passwords
5. **Schema Validation** - Use JSON Schema validation to enforce data structure

## Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [MongoDB University](https://university.mongodb.com/) - Free courses on MongoDB
