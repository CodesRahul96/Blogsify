const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User registered" });
});

// Login - accept either username or email
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Try to find user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});

// Change password (self) - requires current password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
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
    if (!newPassword) return res.status(400).json({ message: 'newPassword is required' });

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
    if (!newUsername) return res.status(400).json({ message: 'newUsername is required' });
    
    // Check if new username is already taken
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update username
    const oldUsername = user.username;
    user.username = newUsername;
    await user.save();

    // Update all posts by this user
    await Post.updateMany({ author: oldUsername }, { author: newUsername });

    // Return updated token with new username
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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
    if (!oldUsername) return res.status(400).json({ message: 'oldUsername is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow if the requester is the same user (username owner) or an admin
    if (user.username !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to sync posts for this user' });
    }

    const result = await Post.updateMany({ author: oldUsername }, { author: user.username });
    res.json({ message: 'Posts synced', matched: result.matchedCount ?? result.n, modified: result.modifiedCount ?? result.nModified });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update avatar (authenticated user)
router.put('/update-avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'avatar is required' });

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = avatar;
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