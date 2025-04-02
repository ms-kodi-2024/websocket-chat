const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 8000;

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('join', (userName) => {
    users.push({ name: userName, id: socket.id });
    console.log(`User joined: ${userName} with id: ${socket.id}`);
    socket.broadcast.emit('newUser', userName);
  });
  
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  
  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.id === socket.id);
    if (index !== -1) {
      const userName = users[index].name;
      console.log(`User left: ${userName} with id: ${socket.id}`);
      socket.broadcast.emit('removeUser', userName);
      users.splice(index, 1);
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });
  
  console.log('I\'ve added a listener on message event \n');
});
