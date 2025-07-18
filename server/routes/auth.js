import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, displayName, photoURL });
      await user.save();
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;