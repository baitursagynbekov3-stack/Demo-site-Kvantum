const router = require('express').Router();
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const { postRules } = require('../middleware/validate');

// GET /api/posts — public, paginated list of published posts
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ published: true })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ published: true })
    ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id — public, single post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts — auth required, create post
router.post('/', authenticateToken, postRules, async (req, res, next) => {
  try {
    const { title, body, tags, published } = req.body;
    const post = await Post.create({
      title,
      body,
      tags: tags || [],
      author: req.user.id,
      published: published || false
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id — auth required, must be author
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    const { title, body, tags, published } = req.body;
    if (title) post.title = title;
    if (body) post.body = body;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    await post.save();
    res.json({ message: 'Post updated', post });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id — auth required, must be author
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
