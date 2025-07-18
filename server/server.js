import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import { setupSocket } from './socket/socketHandlers.js';

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

mongoose.connect('mongodb+srv://ramaphalatc:charmaine@cluster0.j2yynqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

setupSocket(io);

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
