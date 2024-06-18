const mongoose = require("mongoose");
const User = require("./user");

// Define the schema for the Account model
const accountSchema = new mongoose.Schema({
  // Reference to the User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true, // User ID is required
  },
  // Account balance
  balance: {
    type: Number,
    required: true, // Balance is required
  },
});

// Create the Account model from the schema
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
