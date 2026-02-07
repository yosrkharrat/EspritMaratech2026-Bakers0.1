import { User, RCTEvent, Post, Story, Course, AppNotification, Conversation, Message, ChatGroup, ChatMessage } from '@/types';

// ---- Seed Users ----
export const seedUsers: User[] = [
  {
    id: 'u1', name: 'Yosri Kharrat', cin: '123', role: 'admin', group: 'Comité',
    avatar: '', joinDate: '2016-04-21',
    stats: { totalDistance: 2450, totalRuns: 312, avgPace: '5:10', streak: 28, ranking: 1 },
  },
  {
    id: 'u2', name: 'Ahmed Ben Ali', cin: '456', role: 'coach', group: 'Groupe A',
    avatar: '', joinDate: '2017-09-15',
    stats: { totalDistance: 1890, totalRuns: 245, avgPace: '5:05', streak: 14, ranking: 3 },
  },
  {
    id: 'u3', name: 'Salma Gharbi', cin: '789', role: 'group_admin', group: 'Groupe B',
    avatar: '', joinDate: '2019-03-10',
    stats: { totalDistance: 1200, totalRuns: 178, avgPace: '5:45', streak: 7, ranking: 8 },
  },
  {
    id: 'u4', name: 'Youssef Trabelsi', cin: '321', role: 'member', group: 'Groupe A',
    avatar: '', joinDate: '2020-01-20',
    stats: { totalDistance: 847, totalRuns: 156, avgPace: '5:30', streak: 14, ranking: 12 },
  },
  {
    id: 'u5', name: 'Nour Mejri', cin: '654', role: 'member', group: 'Groupe B',
    avatar: '', joinDate: '2021-06-05',
    stats: { totalDistance: 620, totalRuns: 98, avgPace: '5:50', streak: 5, ranking: 18 },
  },
  {
    id: 'u6', name: 'Karim Bouazizi', cin: '987', role: 'member', group: 'Groupe A',
    avatar: '', joinDate: '2022-02-14',
    stats: { totalDistance: 450, totalRuns: 72, avgPace: '6:10', streak: 3, ranking: 25 },
  },
  {
    id: 'u7', name: 'Leila Hammami', cin: '147', role: 'member', group: 'Groupe B',
    avatar: '', joinDate: '2023-04-01',
    stats: { totalDistance: 320, totalRuns: 48, avgPace: '6:30', streak: 2, ranking: 35 },
  },
  {
    id: 'u8', name: 'Mohamed Riahi', cin: '258', role: 'member', group: 'Groupe A',
    avatar: '', joinDate: '2023-08-10',
    stats: { totalDistance: 180, totalRuns: 24, avgPace: '7:00', streak: 1, ranking: 50 },
  },
];

// ---- Seed Events ----
export const seedEvents: RCTEvent[] = [
  {
    id: 'e1', title: 'Sortie matinale Lac de Tunis', date: '2026-02-08', time: '06:30',
    location: 'Lac de Tunis', group: 'Groupe A', type: 'daily',
    description: 'Sortie quotidienne autour du Lac de Tunis. Parcours plat de 8km, idéal pour tous niveaux.',
    participants: ['u1', 'u2', 'u4', 'u6'], createdBy: 'u1', lat: 36.80, lng: 10.18,
  },
  {
    id: 'e2', title: 'Interval Training Stade', date: '2026-02-08', time: '18:00',
    location: 'Stade El Menzah', group: 'Groupe B', type: 'daily',
    description: 'Séance de fractionné: 6x1000m avec 2min de récupération. Apportez de l\'eau!',
    participants: ['u3', 'u5', 'u7'], createdBy: 'u3', lat: 36.83, lng: 10.17,
  },
  {
    id: 'e3', title: 'Sortie longue hebdomadaire', date: '2026-02-09', time: '07:00',
    location: 'Parc du Belvédère', group: 'Tous', type: 'weekly',
    description: 'Sortie longue ouverte à tous les groupes. 15-20km selon le niveau. Ravitaillement au km 10.',
    participants: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'], createdBy: 'u1', lat: 36.82, lng: 10.17,
  },
  {
    id: 'e4', title: 'Semi-Marathon de Carthage', date: '2026-02-15', time: '08:00',
    location: 'Carthage', group: 'Compétition', type: 'race',
    description: 'Course officielle: Semi-marathon de Carthage. Inscription obligatoire. Dossards à retirer la veille.',
    participants: ['u1', 'u2', 'u4'], createdBy: 'u1', lat: 36.86, lng: 10.32,
  },
  {
    id: 'e5', title: 'Footing récupération', date: '2026-02-10', time: '07:00',
    location: 'La Marsa Corniche', group: 'Tous', type: 'daily',
    description: 'Footing léger de récupération en bord de mer. Allure libre, ambiance détendue.',
    participants: ['u4', 'u5', 'u7', 'u8'], createdBy: 'u2', lat: 36.88, lng: 10.33,
  },
  {
    id: 'e6', title: 'Trail Jebel Nahli', date: '2026-02-12', time: '06:00',
    location: 'Forêt de Jebel Nahli', group: 'Groupe A', type: 'weekly',
    description: 'Trail en forêt, dénivelé ~400m. Chaussures de trail obligatoires. Niveau intermédiaire minimum.',
    participants: ['u1', 'u2', 'u6'], createdBy: 'u2', lat: 36.87, lng: 10.07,
  },
  {
    id: 'e7', title: '10km Chronométré', date: '2026-02-22', time: '08:00',
    location: 'Lac de Tunis', group: 'Compétition', type: 'race',
    description: 'Test chronométré sur 10km. Parcours certifié. Classement et temps officiels.',
    participants: ['u1', 'u2', 'u3', 'u4', 'u5'], createdBy: 'u1', lat: 36.80, lng: 10.18,
  },
];

// ---- Seed Posts ----
export const seedPosts: Post[] = [
  {
    id: 'p1', authorId: 'u4', authorName: 'Youssef Trabelsi', authorAvatar: '',
    content: 'Sortie nocturne sous les étoiles ✨ Rien de mieux que courir avec le groupe !',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=450&fit=crop',
    likes: ['u1', 'u2', 'u3', 'u5', 'u6'], comments: [
      { id: 'c1', authorId: 'u2', authorName: 'Ahmed Ben Ali', content: 'Super ambiance! 🔥', createdAt: '2026-02-07T09:00:00' },
      { id: 'c2', authorId: 'u3', authorName: 'Salma Gharbi', content: 'On remet ça quand?', createdAt: '2026-02-07T09:30:00' },
    ],
    distance: '8 km', pace: '5:15/km', createdAt: '2026-02-07T08:00:00', type: 'post',
  },
  {
    id: 'p2', authorId: 'u5', authorName: 'Nour Mejri', authorAvatar: '',
    content: 'Premier 21km ! Le RCT m\'a donné la force d\'y arriver 🏅',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=450&fit=crop',
    likes: ['u1', 'u2', 'u3', 'u4', 'u6', 'u7', 'u8'], comments: [
      { id: 'c3', authorId: 'u1', authorName: 'Yosri Kharrat', content: 'Bravo Nour! 🎉 Fière de toi', createdAt: '2026-02-07T05:00:00' },
      { id: 'c4', authorId: 'u4', authorName: 'Youssef Trabelsi', content: 'La machine! Le marathon est proche', createdAt: '2026-02-07T05:15:00' },
      { id: 'c5', authorId: 'u6', authorName: 'Karim Bouazizi', content: '💪💪💪', createdAt: '2026-02-07T05:30:00' },
    ],
    distance: '21 km', pace: '5:50/km', createdAt: '2026-02-07T04:00:00', type: 'post',
  },
  {
    id: 'p3', authorId: 'u6', authorName: 'Karim Bouazizi', authorAvatar: '',
    content: 'Interval training au stade El Menzah 🔥 6x1000m, les jambes brûlent !',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=450&fit=crop',
    likes: ['u2', 'u3', 'u5'], comments: [
      { id: 'c6', authorId: 'u2', authorName: 'Ahmed Ben Ali', content: 'Le fractionné c\'est la clé!', createdAt: '2026-02-06T19:00:00' },
    ],
    distance: '10 km', createdAt: '2026-02-06T18:00:00', type: 'post',
  },
  {
    id: 'p4', authorId: 'u2', authorName: 'Ahmed Ben Ali', authorAvatar: '',
    content: 'Programme d\'entraînement semi-marathon disponible! Contactez-moi pour le planning personnalisé 📋',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba7b5f15?w=600&h=450&fit=crop',
    likes: ['u1', 'u4', 'u5', 'u7', 'u8'], comments: [
      { id: 'c7', authorId: 'u5', authorName: 'Nour Mejri', content: 'Intéressée! Je t\'envoie un message', createdAt: '2026-02-06T12:00:00' },
    ],
    createdAt: '2026-02-06T10:00:00', type: 'post',
  },
  {
    id: 'p5', authorId: 'u7', authorName: 'Leila Hammami', authorAvatar: '',
    content: 'Yoga de récupération après la sortie longue 🧘‍♀️ #recovery #RCT',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=450&fit=crop',
    likes: ['u3', 'u5'], comments: [],
    createdAt: '2026-02-05T15:00:00', type: 'post',
  },
];

// ---- Seed Stories ----
export const seedStories: Story[] = [
  { id: 's1', authorId: 'u2', authorName: 'Ahmed', authorAvatar: '', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=700&fit=crop', createdAt: new Date(Date.now() - 3600000).toISOString(), viewers: ['u1', 'u4'], caption: 'Entraînement matinal 💪' },
  { id: 's2', authorId: 'u3', authorName: 'Salma', authorAvatar: '', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=700&fit=crop', createdAt: new Date(Date.now() - 7200000).toISOString(), viewers: ['u1'], caption: 'Nouveau PR! 🏆' },
  { id: 's3', authorId: 'u4', authorName: 'Youssef', authorAvatar: '', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=700&fit=crop', createdAt: new Date(Date.now() - 14400000).toISOString(), viewers: [], caption: 'Vue incroyable ce matin 🌅' },
  { id: 's4', authorId: 'u5', authorName: 'Nour', authorAvatar: '', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba7b5f15?w=400&h=700&fit=crop', createdAt: new Date(Date.now() - 18000000).toISOString(), viewers: ['u2', 'u3'], caption: 'Prête pour le semi! 🏃‍♀️' },
  { id: 's5', authorId: 'u6', authorName: 'Karim', authorAvatar: '', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=700&fit=crop', createdAt: new Date(Date.now() - 21600000).toISOString(), viewers: ['u1', 'u5'], caption: 'Stade El Menzah 🏟️' },
];

// ---- Seed Courses ----
export const seedCourses: Course[] = [
  { id: 'cr1', name: 'Tour du Lac de Tunis', distance: '8 km', difficulty: 'Facile', lat: 36.80, lng: 10.18, ratings: [
    { id: 'r1', courseId: 'cr1', userId: 'u1', userName: 'Yosri Kharrat', rating: 5, comment: 'Le classique! Parcours plat et bien entretenu.', createdAt: '2026-01-15' },
    { id: 'r2', courseId: 'cr1', userId: 'u4', userName: 'Youssef Trabelsi', rating: 4, comment: 'Très bien pour les sorties tranquilles.', createdAt: '2026-01-20' },
  ], description: 'Boucle autour du lac, terrain plat. Très fréquenté le matin. Points d\'eau disponibles.' },
  { id: 'cr2', name: 'Parc du Belvédère', distance: '5 km', difficulty: 'Facile', lat: 36.82, lng: 10.17, ratings: [
    { id: 'r3', courseId: 'cr2', userId: 'u3', userName: 'Salma Gharbi', rating: 5, comment: 'Magnifique parc, ombragé en été.', createdAt: '2026-01-10' },
  ], description: 'Parcours dans le parc avec quelques côtes douces. Beau cadre verdoyant au coeur de Tunis.' },
  { id: 'cr3', name: 'Carthage - Sidi Bou Said', distance: '12 km', difficulty: 'Moyen', lat: 36.86, lng: 10.32, ratings: [
    { id: 'r4', courseId: 'cr3', userId: 'u2', userName: 'Ahmed Ben Ali', rating: 5, comment: 'Parcours magnifique avec vue sur la mer!', createdAt: '2026-01-25' },
    { id: 'r5', courseId: 'cr3', userId: 'u5', userName: 'Nour Mejri', rating: 4, comment: 'Belles montées, belles vues. Attention au soleil.', createdAt: '2026-02-01' },
  ], description: 'Parcours côtier vallonné passant par les ruines de Carthage et le village de Sidi Bou Said.' },
  { id: 'cr4', name: 'Forêt de Jebel Nahli', distance: '15 km', difficulty: 'Difficile', lat: 36.87, lng: 10.07, ratings: [
    { id: 'r6', courseId: 'cr4', userId: 'u1', userName: 'Yosri Kharrat', rating: 5, comment: 'Le meilleur trail à Tunis. Dénivelé sérieux!', createdAt: '2026-01-18' },
  ], description: 'Trail en montagne, +400m de D+. Chaussures de trail obligatoires. Eau à emporter.' },
  { id: 'cr5', name: 'La Marsa Corniche', distance: '10 km', difficulty: 'Moyen', lat: 36.88, lng: 10.33, ratings: [
    { id: 'r7', courseId: 'cr5', userId: 'u7', userName: 'Leila Hammami', rating: 4, comment: 'Brise marine agréable. Joli coucher de soleil.', createdAt: '2026-02-03' },
  ], description: 'Parcours en bord de mer, quelques montées. Parfait pour les sorties au coucher du soleil.' },
];

// ---- Seed Notifications ----
export const seedNotifications: AppNotification[] = [
  { id: 'n1', userId: 'u4', title: 'Sortie demain matin!', message: 'Rappel: Sortie matinale au Lac de Tunis à 06:30. Soyez prêts!', type: 'reminder', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), link: '/event/e1' },
  { id: 'n2', userId: 'u4', title: 'Nour a aimé votre post', message: 'Nour Mejri a aimé votre publication', type: 'social', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: '/community' },
  { id: 'n3', userId: 'u4', title: 'Semi-Marathon Carthage', message: 'N\'oubliez pas de vous inscrire pour le semi-marathon du 15 février!', type: 'event', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/event/e4' },
  { id: 'n4', userId: 'u4', title: 'Nouveau programme', message: 'Ahmed Ben Ali a partagé un programme d\'entraînement semi-marathon', type: 'system', read: true, createdAt: new Date(Date.now() - 172800000).toISOString(), link: '/community' },
  { id: 'n5', userId: 'u4', title: 'Bienvenue!', message: 'Bienvenue sur RCT Connect! Explorez les fonctionnalités de l\'app.', type: 'system', read: true, createdAt: new Date(Date.now() - 604800000).toISOString() },
];

// ---- Seed Conversations ----
export const seedConversations: Conversation[] = [
  { id: 'conv1', participantIds: ['u4', 'u2'], participantNames: ['Youssef Trabelsi', 'Ahmed Ben Ali'], participantAvatars: ['', ''], lastMessage: 'Le programme est prêt, je te l\'envoie!', lastMessageTime: new Date(Date.now() - 1800000).toISOString(), unreadCount: 1 },
  { id: 'conv2', participantIds: ['u4', 'u3'], participantNames: ['Youssef Trabelsi', 'Salma Gharbi'], participantAvatars: ['', ''], lastMessage: 'On se retrouve au stade?', lastMessageTime: new Date(Date.now() - 7200000).toISOString(), unreadCount: 0 },
  { id: 'conv3', participantIds: ['u4', 'u1'], participantNames: ['Youssef Trabelsi', 'Yosri Kharrat'], participantAvatars: ['', ''], lastMessage: 'Merci pour l\'info!', lastMessageTime: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0 },
];

export const seedMessages: Message[] = [
  { id: 'm1', senderId: 'u2', receiverId: 'u4', content: 'Salut! Tu veux le programme semi-marathon?', createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: 'm2', senderId: 'u4', receiverId: 'u2', content: 'Oui bien sûr! Merci coach 🙏', createdAt: new Date(Date.now() - 3600000).toISOString(), read: true },
  { id: 'm3', senderId: 'u2', receiverId: 'u4', content: 'Le programme est prêt, je te l\'envoie!', createdAt: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: 'm4', senderId: 'u3', receiverId: 'u4', content: 'Sortie demain matin?', createdAt: new Date(Date.now() - 10800000).toISOString(), read: true },
  { id: 'm5', senderId: 'u4', receiverId: 'u3', content: 'On se retrouve au stade?', createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: 'm6', senderId: 'u1', receiverId: 'u4', content: 'N\'oublie pas l\'inscription pour le semi!', createdAt: new Date(Date.now() - 172800000).toISOString(), read: true },
  { id: 'm7', senderId: 'u4', receiverId: 'u1', content: 'Merci pour l\'info!', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
];

// ---- Seed Chat Groups ----
export const seedChatGroups: ChatGroup[] = [
  {
    id: 'cg1',
    name: 'Groupe A - Entraînements',
    description: 'Informations et annonces pour le Groupe A',
    memberIds: ['u1', 'u2', 'u4', 'u6', 'u8'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    lastMessage: 'Rappel: sortie demain à 6h30 au Lac!',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    lastMessageSender: 'Ahmed Ben Ali',
  },
  {
    id: 'cg2',
    name: 'Groupe B - Entraînements',
    description: 'Informations et annonces pour le Groupe B',
    memberIds: ['u1', 'u3', 'u5', 'u7'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    lastMessage: 'Séance fractionné confirmée pour demain 18h',
    lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
    lastMessageSender: 'Salma Gharbi',
  },
  {
    id: 'cg3',
    name: 'Semi-Marathon Carthage',
    description: 'Groupe pour les participants au semi-marathon',
    memberIds: ['u1', 'u2', 'u4'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    lastMessage: 'Dossards à retirer samedi matin!',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    lastMessageSender: 'Yosri Kharrat',
  },
];

// ---- Seed Chat Messages ----
export const seedChatMessages: ChatMessage[] = [
  { id: 'cm1', groupId: 'cg1', senderId: 'u1', senderName: 'Yosri Kharrat', senderRole: 'admin', content: 'Bienvenue dans le groupe A! Ici vous recevrez toutes les infos sur les entraînements.', createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: 'cm2', groupId: 'cg1', senderId: 'u2', senderName: 'Ahmed Ben Ali', senderRole: 'coach', content: 'N\'hésitez pas à me contacter pour vos questions techniques!', createdAt: new Date(Date.now() - 518400000).toISOString() },
  { id: 'cm3', groupId: 'cg1', senderId: 'u2', senderName: 'Ahmed Ben Ali', senderRole: 'coach', content: 'Rappel: sortie demain à 6h30 au Lac!', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'cm4', groupId: 'cg2', senderId: 'u1', senderName: 'Yosri Kharrat', senderRole: 'admin', content: 'Groupe B, bienvenue! Salma est votre responsable de groupe.', createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: 'cm5', groupId: 'cg2', senderId: 'u3', senderName: 'Salma Gharbi', senderRole: 'group_admin', content: 'Programme de la semaine disponible!', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'cm6', groupId: 'cg2', senderId: 'u3', senderName: 'Salma Gharbi', senderRole: 'group_admin', content: 'Séance fractionné confirmée pour demain 18h', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'cm7', groupId: 'cg3', senderId: 'u1', senderName: 'Yosri Kharrat', senderRole: 'admin', content: 'Groupe créé pour coordonner notre participation au semi-marathon!', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 'cm8', groupId: 'cg3', senderId: 'u2', senderName: 'Ahmed Ben Ali', senderRole: 'coach', content: 'Je vous prépare un plan de préparation spécifique.', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'cm9', groupId: 'cg3', senderId: 'u1', senderName: 'Yosri Kharrat', senderRole: 'admin', content: 'Dossards à retirer samedi matin!', createdAt: new Date(Date.now() - 86400000).toISOString() },
];
