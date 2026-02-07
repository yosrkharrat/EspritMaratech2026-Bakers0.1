import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dbHelper, DbNotification } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/notifications - Get user's notifications
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { unreadOnly } = req.query;

    let notifications = dbHelper.data.notifications.filter(n => n.user_id === req.user!.userId);

    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.read);
    }

    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const unreadCount = dbHelper.data.notifications.filter(
      n => n.user_id === req.user!.userId && !n.read
    ).length;

    res.json({
      success: true,
      data: notifications,
      meta: { unread_count: unreadCount },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notificationIndex = dbHelper.data.notifications.findIndex(
      n => n.id === req.params.id && n.user_id === req.user!.userId
    );
    if (notificationIndex === -1) {
      return res.status(404).json({ success: false, error: 'Notification non trouvée' });
    }

    dbHelper.data.notifications[notificationIndex].read = true;
    await dbHelper.write();

    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', authenticateToken, async (req: AuthRequest, res) => {
  try {
    dbHelper.data.notifications.forEach(n => {
      if (n.user_id === req.user!.userId) {
        n.read = true;
      }
    });
    await dbHelper.write();

    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notificationIndex = dbHelper.data.notifications.findIndex(
      n => n.id === req.params.id && n.user_id === req.user!.userId
    );
    if (notificationIndex === -1) {
      return res.status(404).json({ success: false, error: 'Notification non trouvée' });
    }

    dbHelper.data.notifications.splice(notificationIndex, 1);
    await dbHelper.write();

    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/notifications/broadcast - Send notification to multiple users (admin/coach only)
router.post('/broadcast', authenticateToken, requireRole('admin', 'coach'), async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      type: z.enum(['event', 'announcement', 'reminder', 'system']),
      title: z.string().min(1),
      message: z.string().min(1),
      related_id: z.string().optional(),
      target_group: z.string().optional(), // Target specific group, or 'all'
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const { type, title, message, related_id, target_group } = validation.data;

    // Get target users
    let targetUsers = dbHelper.data.users;
    if (target_group && target_group !== 'all') {
      targetUsers = targetUsers.filter(u => u.group_name === target_group);
    }

    // Exclude sender
    targetUsers = targetUsers.filter(u => u.id !== req.user!.userId);

    // Create notifications
    const now = new Date().toISOString();
    const notifications: DbNotification[] = targetUsers.map(user => ({
      id: uuidv4(),
      user_id: user.id,
      type,
      title,
      message,
      related_id: related_id || null,
      read: false,
      created_at: now,
    }));

    dbHelper.data.notifications.push(...notifications);
    await dbHelper.write();

    res.status(201).json({
      success: true,
      message: `Notification envoyée à ${notifications.length} utilisateur(s)`,
      data: { count: notifications.length },
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
