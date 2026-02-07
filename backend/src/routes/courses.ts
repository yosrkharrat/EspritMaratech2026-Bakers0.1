import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dbHelper, DbCourse, DbRating } from '../db';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/courses - Get all courses
router.get('/', optionalAuth, (req: AuthRequest, res) => {
  try {
    const { difficulty, minDistance, maxDistance } = req.query;

    let courses = [...dbHelper.data.courses];

    if (difficulty) {
      courses = courses.filter(c => c.difficulty === difficulty);
    }
    if (minDistance) {
      courses = courses.filter(c => c.distance >= Number(minDistance));
    }
    if (maxDistance) {
      courses = courses.filter(c => c.distance <= Number(maxDistance));
    }

    // Add rating info
    const coursesWithRatings = courses.map(course => {
      const ratings = dbHelper.data.ratings.filter(r => r.course_id === course.id);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      const creator = dbHelper.data.users.find(u => u.id === course.created_by);

      return {
        ...course,
        start_point: JSON.parse(course.start_point),
        route_points: JSON.parse(course.route_points),
        average_rating: Math.round(avgRating * 10) / 10,
        rating_count: ratings.length,
        creator: creator ? { id: creator.id, name: creator.name } : null,
      };
    });

    res.json({ success: true, data: coursesWithRatings });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', optionalAuth, (req: AuthRequest, res) => {
  try {
    const course = dbHelper.data.courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Parcours non trouvé' });
    }

    const ratings = dbHelper.data.ratings.filter(r => r.course_id === course.id);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    const ratingsWithUsers = ratings.map(rating => {
      const user = dbHelper.data.users.find(u => u.id === rating.user_id);
      return {
        ...rating,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const creator = dbHelper.data.users.find(u => u.id === course.created_by);
    const userRating = req.user
      ? ratings.find(r => r.user_id === req.user!.userId)
      : null;

    res.json({
      success: true,
      data: {
        ...course,
        start_point: JSON.parse(course.start_point),
        route_points: JSON.parse(course.route_points),
        average_rating: Math.round(avgRating * 10) / 10,
        rating_count: ratings.length,
        ratings: ratingsWithUsers,
        creator: creator ? { id: creator.id, name: creator.name, avatar: creator.avatar } : null,
        user_rating: userRating,
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/courses - Create course
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
      description: z.string().optional(),
      distance: z.number().positive('La distance doit être positive'),
      difficulty: z.enum(['Facile', 'Moyen', 'Difficile']).optional(),
      location: z.string().min(2, 'Lieu requis'),
      start_point: z.object({ lat: z.number(), lng: z.number() }),
      route_points: z.array(z.object({ lat: z.number(), lng: z.number() })).optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const now = new Date().toISOString();
    const newCourse: DbCourse = {
      id: uuidv4(),
      name: validation.data.name,
      description: validation.data.description || null,
      distance: validation.data.distance,
      difficulty: validation.data.difficulty || 'Moyen',
      location: validation.data.location,
      start_point: JSON.stringify(validation.data.start_point),
      route_points: JSON.stringify(validation.data.route_points || [validation.data.start_point]),
      created_by: req.user!.userId,
      created_at: now,
      updated_at: now,
    };

    dbHelper.data.courses.push(newCourse);
    await dbHelper.write();

    res.status(201).json({
      success: true,
      data: {
        ...newCourse,
        start_point: validation.data.start_point,
        route_points: validation.data.route_points || [validation.data.start_point],
        average_rating: 0,
        rating_count: 0,
      },
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const courseIndex = dbHelper.data.courses.findIndex(c => c.id === req.params.id);
    if (courseIndex === -1) {
      return res.status(404).json({ success: false, error: 'Parcours non trouvé' });
    }

    const course = dbHelper.data.courses[courseIndex];
    if (course.created_by !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    const schema = z.object({
      name: z.string().min(3).optional(),
      description: z.string().nullable().optional(),
      distance: z.number().positive().optional(),
      difficulty: z.enum(['Facile', 'Moyen', 'Difficile']).optional(),
      location: z.string().optional(),
      start_point: z.object({ lat: z.number(), lng: z.number() }).optional(),
      route_points: z.array(z.object({ lat: z.number(), lng: z.number() })).optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const updates: any = { ...validation.data, updated_at: new Date().toISOString() };
    if (updates.start_point) updates.start_point = JSON.stringify(updates.start_point);
    if (updates.route_points) updates.route_points = JSON.stringify(updates.route_points);

    Object.assign(dbHelper.data.courses[courseIndex], updates);
    await dbHelper.write();

    res.json({ success: true, data: dbHelper.data.courses[courseIndex] });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const courseIndex = dbHelper.data.courses.findIndex(c => c.id === req.params.id);
    if (courseIndex === -1) {
      return res.status(404).json({ success: false, error: 'Parcours non trouvé' });
    }

    const course = dbHelper.data.courses[courseIndex];
    if (course.created_by !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    dbHelper.data.courses.splice(courseIndex, 1);
    dbHelper.data.ratings = dbHelper.data.ratings.filter(r => r.course_id !== req.params.id);
    await dbHelper.write();

    res.json({ success: true, message: 'Parcours supprimé' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/courses/:id/rate - Rate course
router.post('/:id/rate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const course = dbHelper.data.courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Parcours non trouvé' });
    }

    const schema = z.object({
      rating: z.number().int().min(1).max(5),
      comment: z.string().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    // Check if user already rated
    const existingIndex = dbHelper.data.ratings.findIndex(
      r => r.course_id === req.params.id && r.user_id === req.user!.userId
    );

    if (existingIndex !== -1) {
      // Update existing rating
      dbHelper.data.ratings[existingIndex].rating = validation.data.rating;
      dbHelper.data.ratings[existingIndex].comment = validation.data.comment || null;
    } else {
      // Add new rating
      const newRating: DbRating = {
        id: uuidv4(),
        course_id: req.params.id,
        user_id: req.user!.userId,
        rating: validation.data.rating,
        comment: validation.data.comment || null,
        created_at: new Date().toISOString(),
      };
      dbHelper.data.ratings.push(newRating);
    }

    await dbHelper.write();

    // Calculate new average
    const ratings = dbHelper.data.ratings.filter(r => r.course_id === req.params.id);
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    res.json({
      success: true,
      data: {
        average_rating: Math.round(avgRating * 10) / 10,
        rating_count: ratings.length,
      },
    });
  } catch (error) {
    console.error('Rate course error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
