// create socket connection
const socket = io('http://localhost:5500');

socket.on('connectionEstablished', (data) => {
  console.log(data);
})

module.exports = {socket: socket};