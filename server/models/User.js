const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth users
  googleId: { type: String, default: "" },
  authProvider: { type: String, default: "local" }, // "local" or "google"
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String, default: "" },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: "" },
  twoFactorPendingSecret: { type: String, default: "" },
  twoFactorRecoveryCodes: { type: [String], default: [] },
  twoFactorCode: { type: String, default: "" },
  twoFactorCodeExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
