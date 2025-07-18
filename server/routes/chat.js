import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/send', async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user.uid;
  try {
    const message = new Message({ senderId, receiverId, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;