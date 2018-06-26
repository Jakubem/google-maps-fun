const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

const port = 5500;

// serve public folder as static files
app.use(express.static('public'))

// serve index.html as root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// respond to client connection
io.on('connection', (socket) => {
  console.log('client is ready');

  socket.emit('connectionEstablished', 'backend connected');

  // get all pins from client...
  socket.on('pins', (data) => {
    console.log(data);

    // ...and save them to JSON file
    writeToFile(data)
  })
});

function writeToFile(data) {
  fs.writeFileSync('all-pins.json', data);
}


http.listen(port, () => {
  console.log(`listening on ${port}`);
});