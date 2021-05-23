const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbUrl = 'mongodb+srv://admin:admin@devcluster.zn1mi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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

io.on('connection', (socket) => {
    console.log('New user connected: ', socket.id);
});

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongodb connection successful'))
    .catch((err) => {
        console.log('mongodb connection was unsuccessful: ', err);

    });

const server = http.listen(3000, () => {
    console.log('Server is listening on port: ', server.address().port)
});

