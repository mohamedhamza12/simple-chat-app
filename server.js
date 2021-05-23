const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const config = require('./config');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    next();
});

const dbUrl = config.dbdbConnectionString;

const Message = mongoose.model('Message', {
    sender: String,
    text: String
});

app.get('/messages', (request, response) => {
    Message.find()
        .then(messages => {
            response.status(200);
            response.send(messages);
        })
        .catch((err) => {
            console.log('Getting messages from db was unsuccessful: ', err);
            response.sendStatus(500);
        });

});

app.post('/messages', (request, response) => {
    const message = new Message(request.body);
    message.save()
        .then(() => {
            io.emit('message', request.body);
            response.status(201);
            response.send(request.body);
        })
        .catch((err) => {
            console.log('Saving message to db was unsuccessful: ', err);
            response.sendStatus(500);

        });

});

app.delete('/messages', (request, response) => {
    Message.deleteMany()
        .then(() => {
            io.emit('deleteall');
            response.sendStatus(200);
        })
        .catch((err) => {
            console.log('Messages deletion failed: ', err);
            response.sendStatus(500);
        })
});

let onlineUsersCount = 0;
io.on('connection', (socket) => {
    console.log('New user connected: ', socket.id);
    onlineUsersCount++;
    io.emit('onlinecountupdate', onlineUsersCount);
    socket.on('disconnect', (reason) => {
        onlineUsersCount--;
        io.emit('onlinecountupdate', onlineUsersCount);
    });
});



mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongodb connection successful'))
    .catch((err) => {
        console.log('mongodb connection was unsuccessful: ', err);

    });

const server = http.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port: ', server.address().port)
});

