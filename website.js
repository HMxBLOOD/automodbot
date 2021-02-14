const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
db = require('./database/mongo');
const { webadmin } = require('./config');

app.get('/', (req, res) => {
  if (req.header('X-Replit-User-Id')) {
    if (webadmin.includes(req.header('X-Replit-User-Name'))) {
      res.sendFile('./index.html', { root: __dirname });
    }
    else {
      res.send("you aren't a server admin");
    }
  }
  else {
    res.sendFile('./login.html', { root: __dirname });
  }
});

app.get('/ping', (req, res) => {
  res.send('sent ping');
  console.log('ping recieved');
});

io.on('connection', socket => {
  socket.on('editReason', async (user, reason) => {
    let result = await db.mod.get(user);
    db.mod.update(user, result.time, reason).then(() => {
      io.emit('updated', 'reason updated')
    })
  });
})

io.on('connection', socket => {
  socket.on('delUser', (user, reason) => {
    db.mod.delete(user).then(() => {
      io.emit('updated', 'deleted user')
    })
  });
})

http.listen(3000);