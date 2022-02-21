const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const sanitizer = require('sanitizer');
require('dotenv').config({path:".env"});

var messageArray = [{content:"Server started", name:"SERVER"}];

app.use(express.json());
app.use(express.static(__dirname + '/client'));

app.set('views', __dirname + '/client');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('home.html');
});

app.get('/room', (req, res) => {
    res.render('room.html');
});



io.on('connection', (socket) => {
    console.log(`Socket connected ::(${socket.id})::`);
    
    socket.emit('load-messages', messageArray);
    let sendJoin = {content:"::Joined The Chat::", name:socket.id};
    io.emit('receive-message', sendJoin);
    messageArray.push(sendJoin);
    io.emit('update-member-count', (io.engine.clientsCount));
    console.log(io.sockets.length);
    socket.on('send-message', (data) => {
        sendData = {
            name:sanitizer.escape(data.name + ` ::(${socket.id})::`),
            content:sanitizer.escape(data.content),
            pfp:data.pfp
        }
        messageArray.push(sendData);
        io.emit('receive-message', sendData);
        console.log(sendData);
        messageArray = messageArray.slice(-50);
        console.log(messageArray);
    })
    socket.on('disconnect', () => {
        let sendLeave = {content:"::Left The Chat::", name:socket.id};
        console.log(`Disconnected ${socket.id}`);
        io.emit('receive-message', sendLeave);
        io.emit('update-member-count', (io.engine.clientsCount));
        messageArray.push(sendLeave);
    })
});


server.listen(process.env.PORT, () => {
    console.log("running " + process.env.PORT);
});