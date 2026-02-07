import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dbHelper, DbPost, DbComment, DbPostLike } from '../db';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/posts - Get all posts
router.get('/', optionalAuth, (req: AuthRequest, res) => {
  try {
    const { limit = 20, offset = 0, authorId } = req.query;

    let posts = [...dbHelper.data.posts];

    if (authorId) {
      posts = posts.filter(p => p.author_id === authorId);
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Paginate
    posts = posts.slice(Number(offset), Number(offset) + Number(limit));

    // Add author info and stats
    const postsWithDetails = posts.map(post => {
      const author = dbHelper.data.users.find(u => u.id === post.author_id);
      const likes = dbHelper.data.post_likes.filter(l => l.post_id === post.id);
      const comments = dbHelper.data.comments.filter(c => c.post_id === post.id);
      const isLiked = req.user ? likes.some(l => l.user_id === req.user!.userId) : false;

      return {
        ...post,
        author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
        like_count: likes.length,
        comment_count: comments.length,
        is_liked: isLiked,
      };
    });

    res.json({ success: true, data: postsWithDetails });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', optionalAuth, (req: AuthRequest, res) => {
  try {
    const post = dbHelper.data.posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const author = dbHelper.data.users.find(u => u.id === post.author_id);
    const likes = dbHelper.data.post_likes.filter(l => l.post_id === post.id);
    const comments = dbHelper.data.comments.filter(c => c.post_id === post.id);
    const isLiked = req.user ? likes.some(l => l.user_id === req.user!.userId) : false;

    // Get comment details
    const commentsWithAuthors = comments.map(comment => {
      const commentAuthor = dbHelper.data.users.find(u => u.id === comment.author_id);
      return {
        ...comment,
        author: commentAuthor ? { id: commentAuthor.id, name: commentAuthor.name, avatar: commentAuthor.avatar } : null,
      };
    }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    res.json({
      success: true,
      data: {
        ...post,
        author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
        like_count: likes.length,
        comment_count: comments.length,
        is_liked: isLiked,
        comments: commentsWithAuthors,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/posts - Create post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      content: z.string().min(1, 'Le contenu ne peut pas être vide'),
      image: z.string().url().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const now = new Date().toISOString();
    const newPost: DbPost = {
      id: uuidv4(),
      author_id: req.user!.userId,
      content: validation.data.content,
      image: validation.data.image || null,
      created_at: now,
      updated_at: now,
    };

    dbHelper.data.posts.push(newPost);
    await dbHelper.write();

    const author = dbHelper.data.users.find(u => u.id === req.user!.userId);

    res.status(201).json({
      success: true,
      data: {
        ...newPost,
        author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
        like_count: 0,
        comment_count: 0,
        is_liked: false,
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const postIndex = dbHelper.data.posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const post = dbHelper.data.posts[postIndex];
    if (post.author_id !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    const schema = z.object({
      content: z.string().min(1).optional(),
      image: z.string().url().nullable().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    Object.assign(dbHelper.data.posts[postIndex], validation.data, { updated_at: new Date().toISOString() });
    await dbHelper.write();

    res.json({ success: true, data: dbHelper.data.posts[postIndex] });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const postIndex = dbHelper.data.posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const post = dbHelper.data.posts[postIndex];
    if (post.author_id !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    // Remove post, likes, and comments
    dbHelper.data.posts.splice(postIndex, 1);
    dbHelper.data.post_likes = dbHelper.data.post_likes.filter(l => l.post_id !== req.params.id);
    dbHelper.data.comments = dbHelper.data.comments.filter(c => c.post_id !== req.params.id);
    await dbHelper.write();

    res.json({ success: true, message: 'Publication supprimée' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/posts/:id/like - Toggle like
router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = dbHelper.data.posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const likeIndex = dbHelper.data.post_likes.findIndex(
      l => l.post_id === req.params.id && l.user_id === req.user!.userId
    );

    let liked: boolean;
    if (likeIndex === -1) {
      // Add like
      const newLike: DbPostLike = {
        post_id: req.params.id,
        user_id: req.user!.userId,
        created_at: new Date().toISOString(),
      };
      dbHelper.data.post_likes.push(newLike);
      liked = true;
    } else {
      // Remove like
      dbHelper.data.post_likes.splice(likeIndex, 1);
      liked = false;
    }

    await dbHelper.write();

    const likeCount = dbHelper.data.post_likes.filter(l => l.post_id === req.params.id).length;
    res.json({ success: true, data: { liked, like_count: likeCount } });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/posts/:id/comments - Get comments
router.get('/:id/comments', optionalAuth, (req: AuthRequest, res) => {
  try {
    const post = dbHelper.data.posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const comments = dbHelper.data.comments
      .filter(c => c.post_id === req.params.id)
      .map(comment => {
        const author = dbHelper.data.users.find(u => u.id === comment.author_id);
        return {
          ...comment,
          author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
        };
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/posts/:id/comments - Add comment
router.post('/:id/comments', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = dbHelper.data.posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Publication non trouvée' });
    }

    const schema = z.object({
      content: z.string().min(1, 'Le commentaire ne peut pas être vide'),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const newComment: DbComment = {
      id: uuidv4(),
      post_id: req.params.id,
      author_id: req.user!.userId,
      content: validation.data.content,
      created_at: new Date().toISOString(),
    };

    dbHelper.data.comments.push(newComment);
    await dbHelper.write();

    const author = dbHelper.data.users.find(u => u.id === req.user!.userId);

    res.status(201).json({
      success: true,
      data: {
        ...newComment,
        author: author ? { id: author.id, name: author.name, avatar: author.avatar } : null,
      },
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/posts/:postId/comments/:commentId - Delete comment
router.delete('/:postId/comments/:commentId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const commentIndex = dbHelper.data.comments.findIndex(
      c => c.id === req.params.commentId && c.post_id === req.params.postId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, error: 'Commentaire non trouvé' });
    }

    const comment = dbHelper.data.comments[commentIndex];
    if (comment.author_id !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    dbHelper.data.comments.splice(commentIndex, 1);
    await dbHelper.write();

    res.json({ success: true, message: 'Commentaire supprimé' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
