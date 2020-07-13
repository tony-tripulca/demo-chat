var express = require('express');
var body_parser = require('body-parser');
var app = express();

app.use(express.static('./public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));

var messages = [
    { name: 'Tim', message: 'Hi' },
    { name: 'Jane', message: 'Hello' },
];

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/messages', (req, res) => {
    messages.push(req.body);
    res.sendStatus(200);
});

var server = app.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
