const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateSecret, generateURI, verifySync } = require("otplib");
const QRCode = require("qrcode");
const User = require("../models/User");
const Post = require("../models/Post");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

// Helper to escape regex characters
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to validate email format
const isValidEmail = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generates a clean, professional unique username based on base name
const generateUniqueUsername = async (base) => {
  let cleanBase = String(base || "writer")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 18);

  if (cleanBase.length < 3) cleanBase = "member";

  // Check if base is already available
  const existingExact = await User.findOne({
    username: { $regex: new RegExp(`^${escapeRegex(cleanBase)}$`, "i") }
  });
  if (!existingExact) return cleanBase;

  // Otherwise, append professional random numeric suffix (e.g. alex_4829, rahul_719)
  for (let attempts = 0; attempts < 15; attempts++) {
    const num = crypto.randomInt(100, 9999);
    const candidate = `${cleanBase}_${num}`;
    const taken = await User.findOne({
      username: { $regex: new RegExp(`^${escapeRegex(candidate)}$`, "i") }
    });
    if (!taken) return candidate;
  }

  // Fallback with timestamp hash
  return `${cleanBase}_${Date.now().toString(36).slice(-4)}`;
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate presence and type
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email: trimmedEmail });
    if (existingEmail) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Determine clean username
    let chosenUsername = "";
    if (typeof username === "string" && username.trim()) {
      let cleanInput = username
        .trim()
        .replace(/[^a-zA-Z0-9_.-]/g, "")
        .substring(0, 24);

      if (cleanInput.length < 3) {
        cleanInput = trimmedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || "user";
      }

      // Check if candidate username is available
      const exists = await User.findOne({
        username: { $regex: new RegExp(`^${escapeRegex(cleanInput)}$`, "i") }
      });

      if (exists) {
        // Automatically make it uniquely numbered & professional
        chosenUsername = await generateUniqueUsername(cleanInput);
      } else {
        chosenUsername = cleanInput;
      }
    } else {
      // Auto-generate from email prefix
      const emailPrefix = trimmedEmail.split("@")[0];
      chosenUsername = await generateUniqueUsername(emailPrefix);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: chosenUsername,
      email: trimmedEmail,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      message: "Account created successfully. You can now log in.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username or email already in use" });
    }
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
});

// Login - accept either username or email
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }

    const query = username.trim();
    // Try to find user by username (case-insensitive) or email
    const safeRegex = new RegExp(`^${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const user = await User.findOne({
      $or: [{ username: safeRegex }, { email: query.toLowerCase() }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2-Step Verification Check: Check if user has TOTP enabled
    if (user.twoFactorEnabled) {
      return res.json({
        requires2FA: true,
        userId: user._id,
        email: user.email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3"), // Masked email
        message: "Two-step verification required. Enter the 6-digit code from your authenticator app.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        twoFactorEnabled: !!user.twoFactorEnabled,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin, twoFactorEnabled: !!user.twoFactorEnabled } });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

// Verify 2-Step Verification TOTP code during Login
router.post("/verify-2fa", async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      return res.status(400).json({ message: "userId and verification code are required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: "Invalid request or 2FA not enabled" });
    }

    const cleanCode = String(code).trim().replace(/\s/g, "");
    const checkResult = verifySync({
      token: cleanCode,
      secret: user.twoFactorSecret,
    });
    const isValid = Boolean(checkResult?.valid);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid verification code. Please check your authenticator app." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        twoFactorEnabled: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        twoFactorEnabled: true,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error verifying 2FA", error: err.message });
  }
});

// 2FA Setup: Generate TOTP secret and QR code for Authenticator apps (Google Auth, Microsoft Auth, etc.)
router.post("/2fa/setup", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate standard base32 secret
    const secret = generateSecret();
    const otpauth = generateURI({
      issuer: "Blogsify",
      label: user.email,
      secret,
    });
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Save temporary secret to user (not yet activated until verified)
    user.twoFactorSecret = secret;
    await user.save();

    res.json({
      secret,
      qrCodeUrl,
      otpauth,
      message: "Scan the QR code with Google Authenticator, Authy, or 1Password.",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate 2FA setup", error: err.message });
  }
});

// 2FA Verify & Activate: Confirm the code generated by the Authenticator app
router.post("/2fa/verify-setup", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "No 2FA setup in progress. Please start setup again." });
    }

    const cleanCode = String(code).trim().replace(/\s/g, "");
    const checkResult = verifySync({
      token: cleanCode,
      secret: user.twoFactorSecret,
    });
    const isValid = Boolean(checkResult?.valid);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid code from authenticator app. Please try again." });
    }

    // Mark 2FA as officially active
    user.twoFactorEnabled = true;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        twoFactorEnabled: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Two-step verification enabled and confirmed successfully!",
      twoFactorEnabled: true,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify 2FA setup", error: err.message });
  }
});

// 2FA Disable: Require user password or auth confirmation to disable 2FA
router.post("/2fa/disable", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password if provided
    if (password) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Incorrect password" });
      }
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = "";
    user.twoFactorCode = "";
    user.twoFactorCodeExpires = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        twoFactorEnabled: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Two-step verification has been disabled.",
      twoFactorEnabled: false,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to disable 2FA", error: err.message });
  }
});

// Current User Profile (auth required)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -twoFactorCode");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user profile", error: err.message });
  }
});

// Change password (self) - requires current password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: reset password for any user
router.put('/reset-password/:id', auth, isAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (typeof newPassword !== 'string' || !newPassword) {
      return res.status(400).json({ message: 'newPassword is required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete own account (authenticated)
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    // Delete posts authored by this user's username
    if (user.username) {
      await Post.deleteMany({ author: user.username });
    }

    // Remove this user's comments from other posts
    await Post.updateMany(
      { 'comments.user': req.user.id },
      { $pull: { comments: { user: req.user.id } } }
    );

    // Remove likes by this user
    await Post.updateMany(
      { likes: req.user.id },
      { $pull: { likes: req.user.id } }
    );

    res.json({ message: 'Account and related content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: delete any user account
router.delete('/user/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting yourself
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account as admin. Use delete-account instead.' });
    }

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    // Delete posts authored by this user's username
    if (user.username) {
      await Post.deleteMany({ author: user.username });
    }

    // Remove this user's comments from other posts
    await Post.updateMany(
      { 'comments.user': req.params.id },
      { $pull: { comments: { user: req.params.id } } }
    );

    // Remove likes by this user
    await Post.updateMany(
      { likes: req.params.id },
      { $pull: { likes: req.params.id } }
    );

    res.json({ message: 'User and related content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update username (authenticated user)
router.put('/update-username', auth, async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (typeof newUsername !== 'string' || !newUsername.trim()) {
      return res.status(400).json({ message: 'newUsername is required and must be a string' });
    }

    const trimmedNew = newUsername.trim();

    if (trimmedNew.length < 3 || trimmedNew.length > 30) {
      return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedNew)) {
      return res.status(400).json({ message: 'Username can only contain letters, numbers, underscores, dots, and hyphens' });
    }

    // Check if new username is already taken (case-insensitive)
    const safeRegex = new RegExp(`^${trimmedNew.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const existingUser = await User.findOne({ username: safeRegex });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update username
    const oldUsername = user.username;
    user.username = trimmedNew;
    await user.save();

    // Update all posts by this user
    await Post.updateMany({ author: oldUsername }, { author: trimmedNew });

    // Return updated token with new username (same 7d expiry as login)
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Username updated successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Sync posts authored under an old username to the current username
// Body: { oldUsername: string }
// Only the user who owns the new username or an admin can perform this
router.put('/sync-posts', auth, async (req, res) => {
  try {
    const { oldUsername } = req.body;
    if (typeof oldUsername !== 'string' || !oldUsername.trim()) {
      return res.status(400).json({ message: 'oldUsername is required and must be a string' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow if the requester is the same user (username owner) or an admin
    if (user.username !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to sync posts for this user' });
    }

    const result = await Post.updateMany({ author: oldUsername.trim() }, { author: user.username });
    res.json({ message: 'Posts synced', matched: result.matchedCount ?? result.n, modified: result.modifiedCount ?? result.nModified });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update avatar (authenticated user)
router.put('/update-avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (typeof avatar !== 'string' || !avatar.trim()) {
      return res.status(400).json({ message: 'avatar is required and must be a string' });
    }

    // Basic URL safety check
    const trimmedAvatar = avatar.trim();
    if (trimmedAvatar.length > 2048) {
      return res.status(400).json({ message: 'Avatar URL is too long' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = trimmedAvatar;
    await user.save();

    // Return updated user (no token change)
    res.json({ message: 'Avatar updated', user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    }});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;