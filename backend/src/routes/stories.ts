import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dbHelper, DbStory, DbStoryView } from '../db';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/stories - Get all active stories
router.get('/', optionalAuth, (req: AuthRequest, res) => {
  try {
    const now = new Date().toISOString();

    // Filter active stories (not expired)
    const activeStories = dbHelper.data.stories.filter(s => s.expires_at > now);

    // Group by user
    const storyGroups = new Map<string, typeof activeStories>();
    activeStories.forEach(story => {
      const existing = storyGroups.get(story.user_id) || [];
      existing.push(story);
      storyGroups.set(story.user_id, existing);
    });

    // Format response
    const storiesWithDetails = Array.from(storyGroups.entries()).map(([userId, stories]) => {
      const user = dbHelper.data.users.find(u => u.id === userId);
      const viewedStoryIds = req.user
        ? dbHelper.data.story_views
            .filter(v => v.user_id === req.user!.userId && stories.some(s => s.id === v.story_id))
            .map(v => v.story_id)
        : [];

      return {
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
        stories: stories.map(s => ({
          ...s,
          viewed: viewedStoryIds.includes(s.id),
        })),
        hasUnviewed: stories.some(s => !viewedStoryIds.includes(s.id)),
      };
    });

    // Sort: unviewed first
    storiesWithDetails.sort((a, b) => {
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return 0;
    });

    res.json({ success: true, data: storiesWithDetails });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/stories/:id - Get single story
router.get('/:id', optionalAuth, (req: AuthRequest, res) => {
  try {
    const story = dbHelper.data.stories.find(s => s.id === req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story non trouvée' });
    }

    const now = new Date().toISOString();
    if (story.expires_at < now) {
      return res.status(410).json({ success: false, error: 'Story expirée' });
    }

    const user = dbHelper.data.users.find(u => u.id === story.user_id);
    const viewed = req.user
      ? dbHelper.data.story_views.some(v => v.story_id === story.id && v.user_id === req.user!.userId)
      : false;
    const viewCount = dbHelper.data.story_views.filter(v => v.story_id === story.id).length;

    res.json({
      success: true,
      data: {
        ...story,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
        viewed,
        view_count: viewCount,
      },
    });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/stories - Create story
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      image: z.string().url('URL d\'image invalide'),
      caption: z.string().max(200).optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newStory: DbStory = {
      id: uuidv4(),
      user_id: req.user!.userId,
      image: validation.data.image,
      caption: validation.data.caption || null,
      expires_at: expires.toISOString(),
      created_at: now.toISOString(),
    };

    dbHelper.data.stories.push(newStory);
    await dbHelper.write();

    const user = dbHelper.data.users.find(u => u.id === req.user!.userId);

    res.status(201).json({
      success: true,
      data: {
        ...newStory,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
        viewed: false,
        view_count: 0,
      },
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/stories/:id/view - Mark story as viewed
router.post('/:id/view', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const story = dbHelper.data.stories.find(s => s.id === req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story non trouvée' });
    }

    // Check if already viewed
    const existing = dbHelper.data.story_views.find(
      v => v.story_id === req.params.id && v.user_id === req.user!.userId
    );
    if (existing) {
      return res.json({ success: true, message: 'Déjà vue' });
    }

    const newView: DbStoryView = {
      story_id: req.params.id,
      user_id: req.user!.userId,
      viewed_at: new Date().toISOString(),
    };

    dbHelper.data.story_views.push(newView);
    await dbHelper.write();

    res.json({ success: true, message: 'Story marquée comme vue' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/stories/:id - Delete story
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const storyIndex = dbHelper.data.stories.findIndex(s => s.id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ success: false, error: 'Story non trouvée' });
    }

    const story = dbHelper.data.stories[storyIndex];
    if (story.user_id !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    dbHelper.data.stories.splice(storyIndex, 1);
    dbHelper.data.story_views = dbHelper.data.story_views.filter(v => v.story_id !== req.params.id);
    await dbHelper.write();

    res.json({ success: true, message: 'Story supprimée' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
