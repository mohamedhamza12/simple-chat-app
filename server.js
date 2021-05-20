const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))

let messages = []

app.get('/messages', (request, response) => {
    response.status(200);
    response.send(messages);
});

app.post('/messages', (request, response) => {
    response.status(201);

    messages.push(request.body);
    response.send(request.body);
})

const server = app.listen(3000, () => {
    console.log('Server is listening on port: ', server.address().port)
});

