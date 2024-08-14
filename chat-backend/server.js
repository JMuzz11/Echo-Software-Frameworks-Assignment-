const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors());                            //Middleware Setup
app.use(bodyParser.json());

app.get('/', (req, res) => {               // Define a simple route
  res.send('Chat App Backend');
});

const server = http.createServer(app);     // Create an HTTP server and integrate Socket.IO
const io = socketIo(server);

io.on('connection', (socket) => {          // Socket.IO connection handler
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;     // Define the port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));   // Start the server
