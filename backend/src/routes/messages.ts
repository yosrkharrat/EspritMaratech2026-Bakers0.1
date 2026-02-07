import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dbHelper, DbConversation, DbConversationParticipant, DbMessage } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to get conversation details
function getConversationDetails(conversationId: string, userId: string) {
  const conversation = dbHelper.data.conversations.find(c => c.id === conversationId);
  if (!conversation) return null;

  const participantIds = dbHelper.data.conversation_participants
    .filter(cp => cp.conversation_id === conversationId)
    .map(cp => cp.user_id);

  const participants = participantIds
    .map(id => dbHelper.data.users.find(u => u.id === id))
    .filter(Boolean)
    .map(u => ({ id: u!.id, name: u!.name, avatar: u!.avatar }));

  const messages = dbHelper.data.messages
    .filter(m => m.conversation_id === conversationId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const lastMessage = messages[0];
  const unreadCount = messages.filter(m => m.sender_id !== userId && !m.read).length;

  return {
    id: conversationId,
    participants,
    last_message: lastMessage?.content || null,
    last_message_time: lastMessage?.created_at || null,
    unread_count: unreadCount,
  };
}

// GET /api/messages/conversations - Get user's conversations
router.get('/conversations', authenticateToken, (req: AuthRequest, res) => {
  try {
    const userConversationIds = dbHelper.data.conversation_participants
      .filter(cp => cp.user_id === req.user!.userId)
      .map(cp => cp.conversation_id);

    const conversations = userConversationIds
      .map(id => getConversationDetails(id, req.user!.userId))
      .filter(Boolean)
      .sort((a, b) => {
        if (!a!.last_message_time) return 1;
        if (!b!.last_message_time) return -1;
        return new Date(b!.last_message_time).getTime() - new Date(a!.last_message_time).getTime();
      });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/messages/conversations/:id - Get messages in a conversation
router.get('/conversations/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    // Check if user is participant
    const isParticipant = dbHelper.data.conversation_participants.some(
      cp => cp.conversation_id === req.params.id && cp.user_id === req.user!.userId
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    const { limit = 50, before } = req.query;

    let messages = dbHelper.data.messages
      .filter(m => m.conversation_id === req.params.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (before) {
      messages = messages.filter(m => new Date(m.created_at) < new Date(before as string));
    }

    messages = messages.slice(0, Number(limit));

    // Add sender info
    const messagesWithSender = messages.map(m => {
      const sender = dbHelper.data.users.find(u => u.id === m.sender_id);
      return {
        ...m,
        sender: sender ? { id: sender.id, name: sender.name, avatar: sender.avatar } : null,
      };
    }).reverse(); // Oldest first

    // Mark as read
    dbHelper.data.messages.forEach(m => {
      if (m.conversation_id === req.params.id && m.sender_id !== req.user!.userId && !m.read) {
        m.read = true;
      }
    });
    dbHelper.write();

    const conversation = getConversationDetails(req.params.id, req.user!.userId);

    res.json({
      success: true,
      data: {
        conversation,
        messages: messagesWithSender,
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/messages/conversations - Start new conversation
router.post('/conversations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      participant_id: z.string(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const { participant_id } = validation.data;

    if (participant_id === req.user!.userId) {
      return res.status(400).json({ success: false, error: 'Impossible de créer une conversation avec vous-même' });
    }

    // Check if other user exists
    const otherUser = dbHelper.data.users.find(u => u.id === participant_id);
    if (!otherUser) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    // Check if conversation already exists
    const userConversations = dbHelper.data.conversation_participants
      .filter(cp => cp.user_id === req.user!.userId)
      .map(cp => cp.conversation_id);

    for (const convId of userConversations) {
      const participants = dbHelper.data.conversation_participants
        .filter(cp => cp.conversation_id === convId)
        .map(cp => cp.user_id);
      if (participants.length === 2 && participants.includes(participant_id)) {
        // Conversation exists
        const conversation = getConversationDetails(convId, req.user!.userId);
        return res.json({ success: true, data: conversation });
      }
    }

    // Create new conversation
    const now = new Date().toISOString();
    const conversationId = uuidv4();

    const newConversation: DbConversation = {
      id: conversationId,
      created_at: now,
      updated_at: now,
    };

    const participant1: DbConversationParticipant = {
      conversation_id: conversationId,
      user_id: req.user!.userId,
      joined_at: now,
    };

    const participant2: DbConversationParticipant = {
      conversation_id: conversationId,
      user_id: participant_id,
      joined_at: now,
    };

    dbHelper.data.conversations.push(newConversation);
    dbHelper.data.conversation_participants.push(participant1, participant2);
    await dbHelper.write();

    const conversation = getConversationDetails(conversationId, req.user!.userId);

    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/messages/conversations/:id/messages - Send message
router.post('/conversations/:id/messages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Check if user is participant
    const isParticipant = dbHelper.data.conversation_participants.some(
      cp => cp.conversation_id === req.params.id && cp.user_id === req.user!.userId
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    const schema = z.object({
      content: z.string().min(1, 'Le message ne peut pas être vide'),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message });
    }

    const now = new Date().toISOString();
    const newMessage: DbMessage = {
      id: uuidv4(),
      conversation_id: req.params.id,
      sender_id: req.user!.userId,
      content: validation.data.content,
      read: false,
      created_at: now,
    };

    dbHelper.data.messages.push(newMessage);

    // Update conversation timestamp
    const convIndex = dbHelper.data.conversations.findIndex(c => c.id === req.params.id);
    if (convIndex !== -1) {
      dbHelper.data.conversations[convIndex].updated_at = now;
    }

    await dbHelper.write();

    const sender = dbHelper.data.users.find(u => u.id === req.user!.userId);

    res.status(201).json({
      success: true,
      data: {
        ...newMessage,
        sender: sender ? { id: sender.id, name: sender.name, avatar: sender.avatar } : null,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/messages/:messageId/read - Mark message as read
router.put('/:messageId/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const messageIndex = dbHelper.data.messages.findIndex(m => m.id === req.params.messageId);
    if (messageIndex === -1) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    const message = dbHelper.data.messages[messageIndex];

    // Verify user is participant
    const isParticipant = dbHelper.data.conversation_participants.some(
      cp => cp.conversation_id === message.conversation_id && cp.user_id === req.user!.userId
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    dbHelper.data.messages[messageIndex].read = true;
    await dbHelper.write();

    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/messages/conversations/:id - Leave conversation
router.delete('/conversations/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const participantIndex = dbHelper.data.conversation_participants.findIndex(
      cp => cp.conversation_id === req.params.id && cp.user_id === req.user!.userId
    );
    if (participantIndex === -1) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    // Remove user from conversation
    dbHelper.data.conversation_participants.splice(participantIndex, 1);

    // If no participants left, delete conversation and messages
    const remainingParticipants = dbHelper.data.conversation_participants.filter(
      cp => cp.conversation_id === req.params.id
    );

    if (remainingParticipants.length === 0) {
      dbHelper.data.conversations = dbHelper.data.conversations.filter(c => c.id !== req.params.id);
      dbHelper.data.messages = dbHelper.data.messages.filter(m => m.conversation_id !== req.params.id);
    }

    await dbHelper.write();

    res.json({ success: true, message: 'Conversation supprimée' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
