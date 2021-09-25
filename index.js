const app = require('express')();

const server = require('http').createServer(app);
const { userJoin, userLeave } = require('./utiles/findId');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const router = require('./router');
app.use(router);

app.use(cors());
const io = require('socket.io')(server);
let Users = [];
let UserID = [];

io.on('connection', (socket) => {
  console.log('Socket is active');

  socket.on('chat', (payload) => {
    io.emit('chat', payload);
  });

  socket.on('join', (payload) => {
    UserID.push({ userName: payload.name, id: payload.id });
    Users.push(payload.name);
    io.emit(
      'join',
      userJoin(
        payload.message,
        payload.user,
        payload.name,
        payload.id,
        payload.time
      )
    );
    io.emit('update', Users);
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      user.message = `${user.userName} has left the chat`;
      io.emit('userLeft', user);
      const index = Users.findIndex((item) => item === user.userName);
      if (index !== -1) {
        Users.splice(index, 1);
        io.emit('index', index);
        setTimeout(() => {
          io.emit('update', Users);
        }, 5000);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
