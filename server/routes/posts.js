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
      .limit(limit)
      .populate({ path: 'comments.user', select: 'username' });
    const totalPosts = await Post.countDocuments();
    // console.log("Sending posts:", posts); // Debug backend
    // Normalize author to an object for frontend compatibility when needed
    const normalized = posts.map((p) => {
      const po = p.toObject();
      po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
      return po;
    });

    res.json({
      posts: normalized,
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
    const post = await Post.findById(req.params.id).populate({ path: 'comments.user', select: 'username' });
    if (!post) return res.status(404).json({ message: "Post not found" });
    const po = post.toObject();
    po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
    res.json(po);
  } catch (err) {
    // console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a post (authenticated users)
router.post("/", auth, async (req, res) => {
  try {
    // Use username from the token to prevent forged authorship
    const author = req.user && req.user.username ? req.user.username : "Anonymous";
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      author,
      likes: [],
      comments: [],
    });
    await post.save();
    // return populated normalized post
    const created = await Post.findById(post._id).populate({ path: 'comments.user', select: 'username' });
    const po = created.toObject();
    po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error creating post" });
  }
});


// Update a post (owner or admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow only the post owner (by username) or admin to update
    if (post.author !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;
    post.imageUrl = req.body.imageUrl ?? post.imageUrl;
    // do not allow changing author via request

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error updating post" });
  }
});

// Delete a post (owner or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow only the post owner (by username) or admin to delete
    if (post.author !== req.user.username && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
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
    const updated = await Post.findById(post._id).populate({ path: 'comments.user', select: 'username' });
    const po = updated.toObject();
    po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
    res.json(po);
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
    const updated = await Post.findById(post._id).populate({ path: 'comments.user', select: 'username' });
    const po = updated.toObject();
    po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
    res.json(po);
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
    const updated = await Post.findById(post._id).populate({ path: 'comments.user', select: 'username' });
    const po = updated.toObject();
    po.author = typeof po.author === 'string' ? { username: po.author } : po.author;
    res.json(po); // Return updated post
  } catch (err) {
    // console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;