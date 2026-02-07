import { Router } from 'express';
import { z } from 'zod';
import { dbHelper, DbUserSettings } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/settings - Get current user settings
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    let settings = dbHelper.data.user_settings.find(s => s.user_id === req.user!.userId);

    // Create default settings if not exists
    if (!settings) {
      const defaultSettings: DbUserSettings = {
        user_id: req.user!.userId,
        theme: 'system',
        language: 'fr',
        notifications_enabled: true,
        email_notifications: true,
      };
      dbHelper.data.user_settings.push(defaultSettings);
      await dbHelper.write();
      settings = defaultSettings;
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/settings - Update user settings
router.put('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      language: z.enum(['fr', 'en', 'ar']).optional(),
      notifications_enabled: z.boolean().optional(),
      email_notifications: z.boolean().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const updates = validation.data;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'Aucune modification fournie' });
    }

    let settingsIndex = dbHelper.data.user_settings.findIndex(s => s.user_id === req.user!.userId);

    if (settingsIndex === -1) {
      // Create settings
      const newSettings: DbUserSettings = {
        user_id: req.user!.userId,
        theme: updates.theme || 'system',
        language: updates.language || 'fr',
        notifications_enabled: updates.notifications_enabled ?? true,
        email_notifications: updates.email_notifications ?? true,
      };
      dbHelper.data.user_settings.push(newSettings);
      settingsIndex = dbHelper.data.user_settings.length - 1;
    } else {
      // Update existing
      Object.assign(dbHelper.data.user_settings[settingsIndex], updates);
    }

    await dbHelper.write();

    res.json({ success: true, data: dbHelper.data.user_settings[settingsIndex] });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/settings/theme - Quick theme update
router.put('/theme', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      theme: z.enum(['light', 'dark', 'system']),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Thème invalide' });
    }

    let settingsIndex = dbHelper.data.user_settings.findIndex(s => s.user_id === req.user!.userId);

    if (settingsIndex === -1) {
      const newSettings: DbUserSettings = {
        user_id: req.user!.userId,
        theme: validation.data.theme,
        language: 'fr',
        notifications_enabled: true,
        email_notifications: true,
      };
      dbHelper.data.user_settings.push(newSettings);
    } else {
      dbHelper.data.user_settings[settingsIndex].theme = validation.data.theme;
    }

    await dbHelper.write();

    res.json({ success: true, data: { theme: validation.data.theme } });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/settings/language - Quick language update
router.put('/language', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      language: z.enum(['fr', 'en', 'ar']),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Langue invalide' });
    }

    let settingsIndex = dbHelper.data.user_settings.findIndex(s => s.user_id === req.user!.userId);

    if (settingsIndex === -1) {
      const newSettings: DbUserSettings = {
        user_id: req.user!.userId,
        theme: 'system',
        language: validation.data.language,
        notifications_enabled: true,
        email_notifications: true,
      };
      dbHelper.data.user_settings.push(newSettings);
    } else {
      dbHelper.data.user_settings[settingsIndex].language = validation.data.language;
    }

    await dbHelper.write();

    res.json({ success: true, data: { language: validation.data.language } });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/settings/notifications - Update notification settings
router.put('/notifications', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      notifications_enabled: z.boolean().optional(),
      email_notifications: z.boolean().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const updates = validation.data;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'Aucune modification fournie' });
    }

    let settingsIndex = dbHelper.data.user_settings.findIndex(s => s.user_id === req.user!.userId);

    if (settingsIndex === -1) {
      const newSettings: DbUserSettings = {
        user_id: req.user!.userId,
        theme: 'system',
        language: 'fr',
        notifications_enabled: updates.notifications_enabled ?? true,
        email_notifications: updates.email_notifications ?? true,
      };
      dbHelper.data.user_settings.push(newSettings);
    } else {
      if (updates.notifications_enabled !== undefined) {
        dbHelper.data.user_settings[settingsIndex].notifications_enabled = updates.notifications_enabled;
      }
      if (updates.email_notifications !== undefined) {
        dbHelper.data.user_settings[settingsIndex].email_notifications = updates.email_notifications;
      }
    }

    await dbHelper.write();

    res.json({ success: true, message: 'Préférences de notification mises à jour' });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
