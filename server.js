var express = require('express');
var body_parser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static('./public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

var Message = mongoose.model('Message', {
    name: String,
    message: String,
}, 'chats');

var messages = [
    { name: 'Tim', message: 'Hi' },
    { name: 'Jane', message: 'Hello' },
];

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);

    message.save((err) => {
        if (err) sendStatus(500);

        messages.push(req.body);
        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');
});

mongoose
    .connect('mongodb://localhost:27017/demo_chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => handleError(error));

mongoose.connection.on('error', (err) => {
    logError(err);
});

var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
