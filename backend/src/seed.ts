import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { dbHelper, DbUser, DbEvent, DbEventParticipant, DbPost, DbPostLike, DbComment, DbStory, DbCourse, DbRating, DbNotification, DbConversation, DbConversationParticipant, DbMessage, DbUserSettings } from './db';

async function seed() {
  // Wait for db to be initialized
  await dbHelper.init();

  console.log('🌱 Seeding database...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  dbHelper.data.users = [];
  dbHelper.data.events = [];
  dbHelper.data.event_participants = [];
  dbHelper.data.posts = [];
  dbHelper.data.post_likes = [];
  dbHelper.data.comments = [];
  dbHelper.data.stories = [];
  dbHelper.data.story_views = [];
  dbHelper.data.courses = [];
  dbHelper.data.ratings = [];
  dbHelper.data.notifications = [];
  dbHelper.data.conversations = [];
  dbHelper.data.conversation_participants = [];
  dbHelper.data.messages = [];
  dbHelper.data.user_settings = [];

  // Generate IDs
  const userIds = {
    admin: uuidv4(),
    coach: uuidv4(),
    member1: uuidv4(),
    member2: uuidv4(),
    member3: uuidv4(),
    member4: uuidv4(),
    member5: uuidv4(),
  };

  const eventIds = {
    weeklyRun: uuidv4(),
    interval: uuidv4(),
    longRun: uuidv4(),
    beginners: uuidv4(),
  };

  const courseIds = {
    lacTunis: uuidv4(),
    belvedere: uuidv4(),
    carthage: uuidv4(),
    radiant: uuidv4(),
  };

  const postIds = {
    post1: uuidv4(),
    post2: uuidv4(),
    post3: uuidv4(),
  };

  const storyIds = {
    story1: uuidv4(),
    story2: uuidv4(),
    story3: uuidv4(),
  };

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);
  const now = new Date().toISOString();

  // Seed Users
  console.log('Creating users...');
  const users: DbUser[] = [
    { id: userIds.admin, email: 'admin@rct.tn', password: hashedPassword, name: 'Ahmed Ben Salem', avatar: 'https://i.pravatar.cc/150?u=admin', role: 'admin', group_name: 'Élite', distance: 1250, runs: 156, joined_events: 89, strava_connected: true, strava_id: 'strava_admin', created_at: now, updated_at: now },
    { id: userIds.coach, email: 'coach@rct.tn', password: hashedPassword, name: 'Fatma Trabelsi', avatar: 'https://i.pravatar.cc/150?u=coach', role: 'coach', group_name: 'Élite', distance: 2100, runs: 245, joined_events: 120, strava_connected: true, strava_id: 'strava_coach', created_at: now, updated_at: now },
    { id: userIds.member1, email: 'mohamed@rct.tn', password: hashedPassword, name: 'Mohamed Khelifi', avatar: 'https://i.pravatar.cc/150?u=mohamed', role: 'member', group_name: 'Intermédiaire', distance: 456, runs: 67, joined_events: 34, strava_connected: true, strava_id: 'strava_mohamed', created_at: now, updated_at: now },
    { id: userIds.member2, email: 'leila@rct.tn', password: hashedPassword, name: 'Leila Mansour', avatar: 'https://i.pravatar.cc/150?u=leila', role: 'member', group_name: 'Intermédiaire', distance: 520, runs: 78, joined_events: 45, strava_connected: false, strava_id: null, created_at: now, updated_at: now },
    { id: userIds.member3, email: 'youssef@rct.tn', password: hashedPassword, name: 'Youssef Chaabane', avatar: 'https://i.pravatar.cc/150?u=youssef', role: 'member', group_name: 'Débutant', distance: 123, runs: 23, joined_events: 12, strava_connected: true, strava_id: 'strava_youssef', created_at: now, updated_at: now },
    { id: userIds.member4, email: 'amira@rct.tn', password: hashedPassword, name: 'Amira Bouazizi', avatar: 'https://i.pravatar.cc/150?u=amira', role: 'member', group_name: 'Débutant', distance: 89, runs: 15, joined_events: 8, strava_connected: false, strava_id: null, created_at: now, updated_at: now },
    { id: userIds.member5, email: 'karim@rct.tn', password: hashedPassword, name: 'Karim Mejri', avatar: 'https://i.pravatar.cc/150?u=karim', role: 'member', group_name: 'Élite', distance: 890, runs: 112, joined_events: 67, strava_connected: true, strava_id: 'strava_karim', created_at: now, updated_at: now },
  ];
  dbHelper.data.users.push(...users);

  // Seed User Settings
  console.log('Creating user settings...');
  const settings: DbUserSettings[] = Object.values(userIds).map(userId => ({
    user_id: userId,
    theme: 'system',
    language: 'fr',
    notifications_enabled: true,
    email_notifications: true,
  }));
  dbHelper.data.user_settings.push(...settings);

  // Seed Events
  console.log('Creating events...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const events: DbEvent[] = [
    {
      id: eventIds.weeklyRun,
      title: 'Sortie Hebdomadaire - Lac de Tunis',
      description: 'Notre sortie classique du samedi matin autour du lac de Tunis. Parcours plat idéal pour tous les niveaux.',
      date: tomorrow.toISOString().split('T')[0],
      time: '07:00',
      location: 'Lac de Tunis - Berges du Lac',
      location_coords: JSON.stringify({ lat: 36.8382, lng: 10.2351 }),
      distance: 10,
      group_name: 'Tous niveaux',
      event_type: 'Sortie',
      max_participants: 50,
      created_by: userIds.coach,
      created_at: now,
      updated_at: now,
    },
    {
      id: eventIds.interval,
      title: 'Entraînement Fractionné',
      description: 'Session de fractionné : 10x400m avec récupération active. Parfait pour améliorer votre VMA.',
      date: tomorrow.toISOString().split('T')[0],
      time: '18:30',
      location: 'Stade El Menzah',
      location_coords: JSON.stringify({ lat: 36.8167, lng: 10.1563 }),
      distance: 8,
      group_name: 'Intermédiaire',
      event_type: 'Entraînement',
      max_participants: 25,
      created_by: userIds.coach,
      created_at: now,
      updated_at: now,
    },
    {
      id: eventIds.longRun,
      title: 'Sortie Longue - Semi-Marathon',
      description: 'Préparation pour le semi-marathon de Carthage. Sortie longue de 21km à allure marathon.',
      date: nextWeek.toISOString().split('T')[0],
      time: '06:30',
      location: 'Carthage - Palais Présidentiel',
      location_coords: JSON.stringify({ lat: 36.8503, lng: 10.3252 }),
      distance: 21,
      group_name: 'Élite',
      event_type: 'Sortie',
      max_participants: 30,
      created_by: userIds.admin,
      created_at: now,
      updated_at: now,
    },
    {
      id: eventIds.beginners,
      title: 'Initiation Course à Pied',
      description: 'Session découverte pour les nouveaux coureurs. Techniques de base et conseils pour bien débuter.',
      date: nextWeek.toISOString().split('T')[0],
      time: '09:00',
      location: 'Parc du Belvédère',
      location_coords: JSON.stringify({ lat: 36.8167, lng: 10.1750 }),
      distance: 5,
      group_name: 'Débutant',
      event_type: 'Initiation',
      max_participants: 20,
      created_by: userIds.coach,
      created_at: now,
      updated_at: now,
    },
  ];
  dbHelper.data.events.push(...events);

  // Seed Event Participants
  console.log('Adding event participants...');
  const participants: DbEventParticipant[] = [
    { event_id: eventIds.weeklyRun, user_id: userIds.admin, joined_at: now },
    { event_id: eventIds.weeklyRun, user_id: userIds.coach, joined_at: now },
    { event_id: eventIds.weeklyRun, user_id: userIds.member1, joined_at: now },
    { event_id: eventIds.weeklyRun, user_id: userIds.member2, joined_at: now },
    { event_id: eventIds.weeklyRun, user_id: userIds.member5, joined_at: now },
    { event_id: eventIds.interval, user_id: userIds.coach, joined_at: now },
    { event_id: eventIds.interval, user_id: userIds.member1, joined_at: now },
    { event_id: eventIds.interval, user_id: userIds.member5, joined_at: now },
    { event_id: eventIds.longRun, user_id: userIds.admin, joined_at: now },
    { event_id: eventIds.longRun, user_id: userIds.member5, joined_at: now },
    { event_id: eventIds.beginners, user_id: userIds.member3, joined_at: now },
    { event_id: eventIds.beginners, user_id: userIds.member4, joined_at: now },
  ];
  dbHelper.data.event_participants.push(...participants);

  // Seed Courses
  console.log('Creating courses...');
  const courses: DbCourse[] = [
    {
      id: courseIds.lacTunis,
      name: 'Tour du Lac de Tunis',
      description: 'Parcours classique autour du lac. Surface plate, idéal pour les débutants et le tempo.',
      distance: 10.5,
      difficulty: 'Facile',
      location: 'Lac de Tunis',
      start_point: JSON.stringify({ lat: 36.8382, lng: 10.2351 }),
      route_points: JSON.stringify([{ lat: 36.8382, lng: 10.2351 }, { lat: 36.8450, lng: 10.2400 }, { lat: 36.8500, lng: 10.2450 }]),
      created_by: userIds.coach,
      created_at: now,
      updated_at: now,
    },
    {
      id: courseIds.belvedere,
      name: 'Boucle du Belvédère',
      description: 'Parcours vallonné à travers le parc. Bon pour le travail de côtes.',
      distance: 5.2,
      difficulty: 'Moyen',
      location: 'Parc du Belvédère',
      start_point: JSON.stringify({ lat: 36.8167, lng: 10.1750 }),
      route_points: JSON.stringify([{ lat: 36.8167, lng: 10.1750 }, { lat: 36.8200, lng: 10.1780 }]),
      created_by: userIds.coach,
      created_at: now,
      updated_at: now,
    },
    {
      id: courseIds.carthage,
      name: 'Carthage Historique',
      description: 'Parcours panoramique entre les ruines de Carthage avec vue sur la mer.',
      distance: 15.0,
      difficulty: 'Difficile',
      location: 'Carthage',
      start_point: JSON.stringify({ lat: 36.8503, lng: 10.3252 }),
      route_points: JSON.stringify([{ lat: 36.8503, lng: 10.3252 }, { lat: 36.8550, lng: 10.3300 }]),
      created_by: userIds.admin,
      created_at: now,
      updated_at: now,
    },
    {
      id: courseIds.radiant,
      name: 'Circuit Radiant',
      description: 'Parcours urbain dans le quartier de Radiant avec plusieurs variantes possibles.',
      distance: 7.8,
      difficulty: 'Moyen',
      location: 'Radiant - Ariana',
      start_point: JSON.stringify({ lat: 36.8600, lng: 10.1650 }),
      route_points: JSON.stringify([{ lat: 36.8600, lng: 10.1650 }, { lat: 36.8650, lng: 10.1700 }]),
      created_by: userIds.member1,
      created_at: now,
      updated_at: now,
    },
  ];
  dbHelper.data.courses.push(...courses);

  // Seed Ratings
  console.log('Adding course ratings...');
  const ratings: DbRating[] = [
    { id: uuidv4(), course_id: courseIds.lacTunis, user_id: userIds.member1, rating: 5, comment: 'Parfait pour les sorties matinales!', created_at: now },
    { id: uuidv4(), course_id: courseIds.lacTunis, user_id: userIds.member2, rating: 4, comment: 'Très agréable, un peu monotone quand même.', created_at: now },
    { id: uuidv4(), course_id: courseIds.belvedere, user_id: userIds.member3, rating: 4, comment: 'Super pour s\'entraîner sur les côtes.', created_at: now },
    { id: uuidv4(), course_id: courseIds.carthage, user_id: userIds.member5, rating: 5, comment: 'Magnifique parcours, vue exceptionnelle!', created_at: now },
  ];
  dbHelper.data.ratings.push(...ratings);

  // Seed Posts
  console.log('Creating posts...');
  const posts: DbPost[] = [
    {
      id: postIds.post1,
      author_id: userIds.coach,
      content: '🏃‍♀️ Superbe sortie ce matin au lac de Tunis ! 15km à 5:30/km avec le groupe Intermédiaire. Bravo à tous pour votre motivation malgré le vent ! #RCT #Running #LacTunis',
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
      created_at: now,
      updated_at: now,
    },
    {
      id: postIds.post2,
      author_id: userIds.member1,
      content: 'Premier semi-marathon terminé ! 1h52 🎉 Merci à tout le club pour les encouragements et les conseils de préparation. Maintenant direction le marathon ! 💪',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
      created_at: now,
      updated_at: now,
    },
    {
      id: postIds.post3,
      author_id: userIds.admin,
      content: '📢 Inscriptions ouvertes pour le 10km de Carthage ! Tarif préférentiel pour les membres RCT. Contactez-nous pour plus d\'infos.',
      image: null,
      created_at: now,
      updated_at: now,
    },
  ];
  dbHelper.data.posts.push(...posts);

  // Seed Post Likes
  console.log('Adding post likes...');
  const likes: DbPostLike[] = [
    { post_id: postIds.post1, user_id: userIds.member1, created_at: now },
    { post_id: postIds.post1, user_id: userIds.member2, created_at: now },
    { post_id: postIds.post1, user_id: userIds.member5, created_at: now },
    { post_id: postIds.post1, user_id: userIds.admin, created_at: now },
    { post_id: postIds.post2, user_id: userIds.coach, created_at: now },
    { post_id: postIds.post2, user_id: userIds.admin, created_at: now },
    { post_id: postIds.post2, user_id: userIds.member2, created_at: now },
    { post_id: postIds.post2, user_id: userIds.member3, created_at: now },
    { post_id: postIds.post2, user_id: userIds.member4, created_at: now },
    { post_id: postIds.post2, user_id: userIds.member5, created_at: now },
    { post_id: postIds.post3, user_id: userIds.member1, created_at: now },
    { post_id: postIds.post3, user_id: userIds.member5, created_at: now },
  ];
  dbHelper.data.post_likes.push(...likes);

  // Seed Comments
  console.log('Adding comments...');
  const comments: DbComment[] = [
    { id: uuidv4(), post_id: postIds.post1, author_id: userIds.member1, content: 'C\'était top ! Vivement la prochaine 💪', created_at: now },
    { id: uuidv4(), post_id: postIds.post1, author_id: userIds.member2, content: 'Merci coach pour les conseils !', created_at: now },
    { id: uuidv4(), post_id: postIds.post2, author_id: userIds.coach, content: 'Félicitations Mohamed ! Belle progression !', created_at: now },
    { id: uuidv4(), post_id: postIds.post2, author_id: userIds.admin, content: 'Bravo ! Le marathon c\'est pour quand ? 😄', created_at: now },
  ];
  dbHelper.data.comments.push(...comments);

  // Seed Stories
  console.log('Creating stories...');
  const storyExpiry = new Date();
  storyExpiry.setHours(storyExpiry.getHours() + 24);

  const stories: DbStory[] = [
    { id: storyIds.story1, user_id: userIds.coach, image: 'https://images.unsplash.com/photo-1461896836934-428b3e8bd60a?w=400', caption: 'Entraînement matinal 🌅', expires_at: storyExpiry.toISOString(), created_at: now },
    { id: storyIds.story2, user_id: userIds.member1, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400', caption: 'Nouveau PR sur 10km ! 🎉', expires_at: storyExpiry.toISOString(), created_at: now },
    { id: storyIds.story3, user_id: userIds.admin, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400', caption: 'RCT en force 💪🇹🇳', expires_at: storyExpiry.toISOString(), created_at: now },
  ];
  dbHelper.data.stories.push(...stories);

  // Seed Notifications
  console.log('Creating notifications...');
  const notifications: DbNotification[] = [
    { id: uuidv4(), user_id: userIds.member1, type: 'event', title: 'Nouvel événement', message: 'Sortie Hebdomadaire - Lac de Tunis a été créé', related_id: eventIds.weeklyRun, read: false, created_at: now },
    { id: uuidv4(), user_id: userIds.member1, type: 'like', title: 'Nouveau like', message: 'Fatma Trabelsi a aimé votre publication', related_id: postIds.post2, read: false, created_at: now },
    { id: uuidv4(), user_id: userIds.member2, type: 'comment', title: 'Nouveau commentaire', message: 'Mohamed a commenté une publication', related_id: postIds.post1, read: false, created_at: now },
    { id: uuidv4(), user_id: userIds.member3, type: 'reminder', title: 'Rappel', message: 'L\'événement Initiation Course à Pied commence bientôt', related_id: eventIds.beginners, read: false, created_at: now },
  ];
  dbHelper.data.notifications.push(...notifications);

  // Seed Conversations
  console.log('Creating conversations...');
  const conversationId1 = uuidv4();
  const conversationId2 = uuidv4();

  const conversations: DbConversation[] = [
    { id: conversationId1, created_at: now, updated_at: now },
    { id: conversationId2, created_at: now, updated_at: now },
  ];
  dbHelper.data.conversations.push(...conversations);

  const convParticipants: DbConversationParticipant[] = [
    { conversation_id: conversationId1, user_id: userIds.coach, joined_at: now },
    { conversation_id: conversationId1, user_id: userIds.member1, joined_at: now },
    { conversation_id: conversationId2, user_id: userIds.admin, joined_at: now },
    { conversation_id: conversationId2, user_id: userIds.member3, joined_at: now },
  ];
  dbHelper.data.conversation_participants.push(...convParticipants);

  // Seed Messages
  console.log('Creating messages...');
  const messages: DbMessage[] = [
    { id: uuidv4(), conversation_id: conversationId1, sender_id: userIds.coach, content: 'Salut Mohamed ! Tu es dispo pour la sortie de samedi ?', read: true, created_at: now },
    { id: uuidv4(), conversation_id: conversationId1, sender_id: userIds.member1, content: 'Oui je serai là ! À quelle heure exactement ?', read: true, created_at: now },
    { id: uuidv4(), conversation_id: conversationId1, sender_id: userIds.coach, content: 'RDV à 7h au parking du lac. On fera 15km.', read: false, created_at: now },
    { id: uuidv4(), conversation_id: conversationId2, sender_id: userIds.admin, content: 'Bienvenue au club Youssef ! N\'hésite pas si tu as des questions.', read: true, created_at: now },
    { id: uuidv4(), conversation_id: conversationId2, sender_id: userIds.member3, content: 'Merci beaucoup ! J\'ai hâte de participer à ma première sortie.', read: false, created_at: now },
  ];
  dbHelper.data.messages.push(...messages);

  // Write all data
  await dbHelper.write();

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📧 Test accounts:');
  console.log('  Admin:  admin@rct.tn / password123');
  console.log('  Coach:  coach@rct.tn / password123');
  console.log('  Member: mohamed@rct.tn / password123');
  console.log('');
}

seed().catch(console.error);
