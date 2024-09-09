const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',  // Allow any origin for simplicity
        methods: ['GET', 'POST'],
    }
});

app.use(cors());

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Handle joining a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', (data) => {
        io.to(data.roomId).emit('receiveMessage', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
