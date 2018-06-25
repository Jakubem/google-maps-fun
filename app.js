const express = require('express');
const app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5500;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('hops', {hops: 'hello'});
    socket.on('pins', (data)=>{
        console.log(data);
    })
});


http.listen(port, () => {
    console.log(`listening on ${port}`);
});