const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String }, // Excerpt/lead paragraph for cards and editorial preview
  content: { type: String, required: true },
  author: { type: String, required: true }, // Could be ref to User if needed
  imageUrl: { type: String }, // Cover image URL
  videoUrl: { type: String }, // Video playback link (YouTube, Vimeo, MP4, etc.)
  category: { type: String, default: "General" }, // Tech, Design, AI, Culture, Opinion, etc.
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  readTime: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Performance and query indexes
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1 });
postSchema.index({ views: -1, createdAt: -1 });
postSchema.index({ title: 'text', subtitle: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);