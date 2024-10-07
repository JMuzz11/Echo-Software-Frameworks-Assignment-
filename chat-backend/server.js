const express = require('express');
const cors = require('cors');
const mongooseConnection = require('./db'); // Import the database connection
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

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/groups', groupRoutes);
app.use('/channel', channelRoutes);

// Basic route to ensure server is running
app.get('/', (req, res) => {
  res.send('Echo backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
