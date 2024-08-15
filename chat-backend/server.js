const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Chat App Backend');
});

// Import routes
const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channel');
const groupRoutes = require('./routes/group');
const userRoutes = require('./routes/user');  // Import user routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);  // Use user routes

// Create an HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Define the port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
