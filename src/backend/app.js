const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

require('dotenv').config()

const port = process.env.APP_PORT || 5500;

// serve public folder as static files
app.use(express.static('dist'))

// serve index.html as root
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'index.html'),
  );
});

// respond to client connection
io.on('connection', (socket) => {
  console.log('client is connected');
  socket.emit('connectionEstablished', 'backend connected');

  // read previous session
fs.readFile('all-pins.json', 'UTF-8', (err, data)=>{
  if(err){
    console.log('no previous session');
    return;
  }
  // create object for GeoJSON form previous session
  socket.emit('session', data);
});

  // get all pins from client...
  socket.on('pins', (data) => {
    console.log(data);

    // ...and save them to JSON file
    writeToFile(data)
  })
});

/**
 * function for saving all markers in one GeoJSON file
 * @param {object} data - all pins as JSON
 */
function writeToFile(data) {
  fs.writeFileSync('all-pins.json', data);
}

// start server on specified port
http.listen(port, () => {
  console.log(`listening on ${port}`);
});