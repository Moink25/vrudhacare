# Razorpay Integration Guide

This guide explains how to set up Razorpay payment integration for VrudhaCare's checkout and donation features.

## Step 1: Create a Razorpay Account

1. Sign up at [Razorpay](https://razorpay.com)
2. Complete the verification process

## Step 2: Get API Keys

1. Log into your Razorpay Dashboard
2. Go to Settings > API Keys
3. Generate a new API key pair
4. You'll receive:
   - Key ID (public key)
   - Key Secret (private key)

## Step 3: Add Keys to Environment Variables

Add your Razorpay keys to the environment files:

### Client (.env file)

```
VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyhere
```

### Server (.env file)

```
RAZORPAY_KEY_ID=rzp_test_yourkeyhere
RAZORPAY_KEY_SECRET=yoursecrethere
```

## Step 4: Add Razorpay Script to HTML

Add the Razorpay script in your `index.html` file in the client directory:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## Step 5: Testing

Razorpay provides test cards for development:

### Test Cards

- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3-digit number
- Name: Any name

### Test UPI

- UPI ID: success@razorpay

### Test Net Banking

- Bank: Any bank from the list
- Choose 'Success' from the options when redirected

## Implementation Details

### Creating an Order (Server-side)

```javascript
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
const order = await razorpay.orders.create({
  amount: amount * 100, // Razorpay accepts amount in paise
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
});
```

### Processing Payment (Client-side)

```javascript
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  name: "VrudhaCare",
  description: "Payment for your order",
  order_id: order.id,
  handler: function (response) {
    // Send payment details to server for verification
    verifyPayment(response);
  },
  prefill: {
    name: user.name,
    email: user.email,
    contact: user.phone,
  },
  theme: {
    color: "#059669",
  },
};

const razorpayInstance = new window.Razorpay(options);
razorpayInstance.open();
```

### Verifying Payment (Server-side)

```javascript
const crypto = require("crypto");

// Verify payment
const generated_signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(orderId + "|" + paymentId)
  .digest("hex");

const is_authentic = generated_signature === razorpay_signature;
```

## Webhooks (Advanced)

For production, set up webhooks to handle payment events:

1. Go to Dashboard > Settings > Webhooks
2. Add a new webhook with your endpoint URL
3. Select events (payment.authorized, payment.failed, etc.)
4. Set a secret for signature verification

## Resources

- [Razorpay Documentation](https://razorpay.com/docs)
- [API Reference](https://razorpay.com/docs/api)
- [Webhooks Guide](https://razorpay.com/docs/webhooks)
