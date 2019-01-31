var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var path = require('path');
users = [];
connections = [];

server.listen(process.env.PORT || 3009);

console.log('Server is running ');

app.use('/css',function(req,res,next){
  // console.log(req.method,req.url);
  next();
});

app.use(express.static(path.join(__dirname,'public') ));


io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected : %s sockets are connected', connections.length);

    //Disconnect
    socket.on('disconnect',function(data){
      if(!socket.username) return;
      users.splice(users.indexOf(socket.username),1);
      updateUsersList();
      connections.splice(connections.indexOf(socket),1);
      console.log('Disconnected: %s sockets connected',connections.length);
    });
    //Send Message
    socket.on('send message',function(data){
      console.log(data);
      io.sockets.emit('new message', { msg: data , user:socket.username });

    });
    //New online users
    socket.on('new user',function (data,callback) {
      console.log(data);
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsersList();
    });
    function updateUsersList() {
      io.sockets.emit('get users',users);
    }

});
