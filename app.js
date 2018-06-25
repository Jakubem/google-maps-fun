const express = require('express');
const app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

const port = 5500;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('hops', 'connected');

    socket.on('pins', (data)=>{
        console.log(data);
        writeToFile(data)
    })
});

function writeToFile(data){
    fs.writeFileSync('all-pins.json', JSON.stringify(data));
}

http.listen(port, () => {
    console.log(`listening on ${port}`);
});