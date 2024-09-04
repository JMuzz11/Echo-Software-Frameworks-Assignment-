const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Import routes
const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/user');
const { router: groupRoutes } = require('./routes/group');
const channelRoutes = require('./routes/channel');

// Enable CORS for the Angular frontend running on http://localhost:4200
app.use(cors({
  origin: 'http://localhost:4200',  // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  credentials: true  // Enable cookies and authentication headers
}));

app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/channel', channelRoutes);

// Basic route to ensure server is running
app.get('/', (req, res) => {
  res.send('Echo backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
