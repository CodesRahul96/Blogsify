const express = require("express");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth"); // Middleware

// Curated editorial labels for easy selection
const DEFAULT_LABELS = [
  "Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Design",
  "Startups",
  "Engineering",
  "Culture",
  "Generative Art",
  "Productivity",
  "Ethical Hacking",
  "Bug Bounty",
  "System Tools",
  "Gaming",
  "Cloud Security",
  "Mobile",
];

// Get list of pre-added editorial labels and popular tags
router.get("/labels", async (req, res) => {
  try {
    const dbTags = await Post.distinct("tags");
    const dbCategories = await Post.distinct("category");
    // Merge predefined labels with existing tags and categories
    const combinedSet = new Set([
      ...DEFAULT_LABELS,
      ...(dbCategories || []),
      ...(dbTags || []),
    ]);
    const labels = Array.from(combinedSet)
      .filter((l) => typeof l === "string" && l.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
    res.json({ labels });
  } catch (err) {
    res.json({ labels: DEFAULT_LABELS });
  }
});

// Get all posts with optional pagination, category filtering, tag filtering, search, and sorting (public)
router.get("/", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const rawLimit = parseInt(req.query.limit) || 6;
  const limit = Math.min(Math.max(1, rawLimit), 50); // Bound between 1 and 50
  const author = req.query.author;
  const category = req.query.category;
  const tag = req.query.tag;
  const search = req.query.search;
  const sort = req.query.sort; // "trending", "popular", or default "latest"
  const snippet = req.query.mode === "snippet";
  const skip = (page - 1) * limit;

  try {
    // Helper: escape regex special characters from user input to prevent ReDoS
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const query = {};
    if (author && typeof author === 'string') {
      // Exact match by username (case-insensitive for safety)
      query.author = { $regex: new RegExp(`^${escapeRegex(author.trim())}$`, 'i') };
    }
    if (category && typeof category === 'string' && category.toLowerCase() !== "all") {
      query.category = new RegExp(`^${escapeRegex(category.trim())}$`, "i");
    }
    if (tag && typeof tag === 'string') {
      query.tags = { $in: [new RegExp(`^${escapeRegex(tag.trim())}$`, "i")] };
    }
    if (search && typeof search === 'string') {
      const safeSearch = escapeRegex(search.trim().substring(0, 200)); // cap length
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { subtitle: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
        { tags: { $in: [new RegExp(safeSearch, "i")] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "trending" || sort === "popular") {
      sortOption = { views: -1, createdAt: -1 };
    }

    const posts = await Post.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate({ path: "comments.user", select: "username" });

    const totalPosts = await Post.countDocuments(query);

    // Normalize and optionally truncate
    const normalized = posts.map((p) => {
      const po = p.toObject();
      po.author =
        typeof po.author === "string" ? { username: po.author } : po.author;
      po.category = po.category || "General";
      po.views = po.views || 0;

      // Calculate read time
      const words = (po.content || "").trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      po.readTime = `${minutes} min read`;

      if (snippet) {
        // Truncate content
        po.content = (po.content || "").substring(0, 200) + "...";
      }

      return po;
    });

    res.json({
      posts: normalized,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      totalPosts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching posts", error: err.message });
  }
});

// Get a single post by ID (public) and increment view count
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post identifier" });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate({
      path: "comments.user",
      select: "username",
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    const po = post.toObject();
    po.author =
      typeof po.author === "string" ? { username: po.author } : po.author;
    po.category = po.category || "General";
    po.views = po.views || 0;

    const words = (po.content || "").trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    po.readTime = `${minutes} min read`;

    res.json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching post", error: err.message });
  }
});

// Create a post (authenticated users)
router.post("/", auth, async (req, res) => {
  try {
    const { title, subtitle, content, imageUrl, videoUrl, category, tags } = req.body;

    if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ message: "Title must be 200 characters or fewer" });
    }
    if (content.trim().length > 200000) {
      return res.status(400).json({ message: "Content is too long (max 200,000 characters)" });
    }

    const author =
      req.user && req.user.username ? req.user.username : "Anonymous";
    
    const words = (content || "").trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    const calculatedReadTime = `${minutes} min read`;

    // Sanitize tags: max 10 tags, each max 50 chars
    const sanitizedTags = Array.isArray(tags)
      ? tags.slice(0, 10).map((t) => String(t).trim().substring(0, 50)).filter(Boolean)
      : [];

    const post = new Post({
      title: title.trim(),
      subtitle: subtitle ? String(subtitle).trim().substring(0, 500) : "",
      content: content.trim(),
      imageUrl: imageUrl ? String(imageUrl).trim().substring(0, 2048) : "",
      videoUrl: videoUrl ? String(videoUrl).trim().substring(0, 2048) : "",
      category: category ? String(category).trim().substring(0, 100) : "General",
      tags: sanitizedTags,
      readTime: calculatedReadTime,
      author,
      likes: [],
      comments: [],
    });
    await post.save();
    
    const created = await Post.findById(post._id).populate({
      path: "comments.user",
      select: "username",
    });
    const po = created.toObject();
    po.author =
      typeof po.author === "string" ? { username: po.author } : po.author;
    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error creating post" });
  }
});

// Update a post (owner or admin)
router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post identifier" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow only the post owner (by username) or admin to update
    if (post.author !== req.user.username && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    if (req.body.title !== undefined) post.title = String(req.body.title).trim();
    if (req.body.subtitle !== undefined) post.subtitle = String(req.body.subtitle).trim();
    if (req.body.content !== undefined) post.content = String(req.body.content).trim();
    if (req.body.imageUrl !== undefined) post.imageUrl = String(req.body.imageUrl).trim();
    if (req.body.videoUrl !== undefined) post.videoUrl = String(req.body.videoUrl).trim();
    if (req.body.category !== undefined) post.category = String(req.body.category).trim();
    if (Array.isArray(req.body.tags)) {
      post.tags = req.body.tags.map((t) => String(t).trim()).filter(Boolean);
    }

    if (req.body.content) {
      const words = post.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      post.readTime = `${minutes} min read`;
    }

    await post.save();
    const updated = await Post.findById(post._id).populate({
      path: "comments.user",
      select: "username",
    });
    const po = updated.toObject();
    po.author = typeof po.author === "string" ? { username: po.author } : po.author;
    res.json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error updating post", error: err.message });
  }
});

// Delete a post (owner or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post identifier" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow only the post owner (by username) or admin to delete
    if (post.author !== req.user.username && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting post", error: err.message });
  }
});

// Like a post (auth required)
router.post("/:id/like", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post identifier" });
    }

    // First check if user already liked — use atomic ops to avoid race conditions
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const postExists = await Post.findById(req.params.id).select('likes');
    if (!postExists) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = postExists.likes.some((id) => id.equals(userId));

    // Use atomic $addToSet (like) or $pull (unlike) — no race condition
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    ).populate({ path: "comments.user", select: "username" });

    if (!updated) return res.status(404).json({ message: "Post not found" });

    const po = updated.toObject();
    po.author = typeof po.author === "string" ? { username: po.author } : po.author;
    res.json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error liking post", error: err.message });
  }
});

// Comment on a post (auth required)
router.post("/:id/comment", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post identifier" });
    }

    const text = req.body.text ? String(req.body.text).trim() : "";
    if (!text) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }
    if (text.length > 2000) {
      return res.status(400).json({ message: "Comment must be 2000 characters or fewer" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ user: req.user.id, text });
    await post.save();
    const updated = await Post.findById(post._id).populate({
      path: "comments.user",
      select: "username",
    });
    const po = updated.toObject();
    po.author =
      typeof po.author === "string" ? { username: po.author } : po.author;
    res.json(po);
  } catch (err) {
    res.status(500).json({ message: "Server error commenting on post", error: err.message });
  }
});

// Delete a comment (auth required, user or admin)
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      !mongoose.Types.ObjectId.isValid(req.params.commentId)
    ) {
      return res.status(400).json({ message: "Invalid post or comment identifier" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if user is the comment owner or an admin
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await post.save();
    const updated = await Post.findById(post._id).populate({
      path: "comments.user",
      select: "username",
    });
    const po = updated.toObject();
    po.author =
      typeof po.author === "string" ? { username: po.author } : po.author;
    res.json(po); // Return updated post
  } catch (err) {
    res.status(500).json({ message: "Server error deleting comment", error: err.message });
  }
});

module.exports = router;
