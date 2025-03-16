const express = require("express");

const Post = require("../models/Post");
const router = express.Router();
const {auth, isAdmin} = require("../middleware/auth") // Middleware



// Get all posts with optional pagination (public)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 6; // Default to 6 posts per page
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    // console.log("Sending posts:", posts); // Debug backend
    res.json({
      posts, // Always an array
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    // console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// Get a single post by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    // console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a post (admin only)
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl, // Include imageUrl from request body
      author: req.body.author || "Admin", // Default to 'Admin' if not provided
      likes: [],
      comments: [],
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    // console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error creating post" });
  }
});


// Update a post (admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        author: req.body.author || "Admin",
      },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    // console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error updating post" });
  }
});

// Delete a post (admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    // console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }
});

// Like a post (auth required)
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    // console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Comment on a post (auth required)
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    // console.error("Error commenting on post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment (auth required, user or admin)
router.delete('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user is the comment owner or an admin
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json(post); // Return updated post
  } catch (err) {
    // console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;