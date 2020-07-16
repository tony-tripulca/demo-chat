var express = require('express');
var body_parser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static('./public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

/**
 * Collection: messages
 * Model: Message
 */
var Message = mongoose.model('Message', {
    name: String,
    message: String,
});

/**
 * Get all documents from the messages collection
 */
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

/**
 * Save latest message from the client
 */
app.post('/messages', (req, res) => {
    var message = new Message(req.body);

    message.save((err) => {
        if (err) sendStatus(500);

        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

/**
 * Connection event from socket.io
 */
io.on('connection', (socket) => {
    console.log('A user connected');
});

/**
 * Establish mongoose connection to mongodb:localhost
 */
mongoose
    .connect('mongodb://localhost:27017/demo_chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => handleError(error));

mongoose.connection.on('error', (err) => {
    console.log(err);
});

/**
 * Start server and listern to port 3000
 */
var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
