const express = require('express');
const cors = require('cors');
const mongooseConnection = require('./db'); // Import the database connection
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const app = express();
const port = 3000;

// Import routes
const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/user');
const { router: groupRoutes } = require('./routes/group');
const { router: channelRoutes } = require('./routes/channel');

// Enable CORS for the Angular frontend running on http://localhost:4200
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Set up file upload middleware using multer (for profile pictures)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // File naming convention
  }
});

const upload = multer({ storage });

// Add a route for uploading profile pictures
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const User = require('./models/User'); // Import User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.avatar = req.file.path; // Save the avatar path in the user model
    await user.save();
    res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/groups', groupRoutes);
app.use('/channel', channelRoutes);
app.use('/uploads', express.static('uploads'));

// Create the HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGroup', (groupId) => {
    if (groupId) {
      socket.join(groupId);
      console.log(`User joined group ${groupId}`);
    } else {
      console.error('Invalid groupId received');
    }
  });

  socket.on('sendMessage', (message) => {
    const groupId = message.groupId;
    if (groupId) {
      io.to(groupId).emit('receiveMessage', message);
      console.log(`Message sent in group ${groupId}:`, message);
    } else {
      console.error('Message received without a valid groupId');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp', // This is the path where the PeerJS server will be accessible
  allow_discovery: true
});

app.use('/peerjs', peerServer);

// Basic route to ensure server is running
app.get('/', (req, res) => {
  res.send('Echo backend server is running!');
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
