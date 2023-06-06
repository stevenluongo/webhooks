const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    const io = res.socket.server.io;
    io.sockets.emit("update-input", "Hello World");
    console.log("Socket is already running");
  }
};

export default SocketHandler;
