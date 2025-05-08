// Script to create an admin user
const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const API_URL = process.env.API_URL || "http://localhost:5000";

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log("== VrudhaCare Admin Creator ==");

    const name = await question("Enter admin name: ");
    const email = await question("Enter admin email: ");
    const password = await question(
      "Enter admin password (min 6 characters): "
    );

    if (!name || !email || !password) {
      console.error("Error: All fields are required");
      rl.close();
      return;
    }

    if (password.length < 6) {
      console.error("Error: Password must be at least 6 characters");
      rl.close();
      return;
    }

    console.log("\nCreating admin user...");

    const response = await axios.post(`${API_URL}/api/users/create-admin`, {
      name,
      email,
      password,
    });

    console.log("\nSuccess!", response.data.message);
    console.log(
      "\nYou can now login with these credentials at the admin login page."
    );
  } catch (error) {
    console.error("Error:", error.response?.data?.message || error.message);
  } finally {
    rl.close();
  }
}

createAdmin();
