class Socket {
  constructor(server) {
    this.server = server;
    this.socketConnec = null;
  }

  initiSocketConnection() {
    const socketIo = require("socket.io")(this.server, {
      cors: {
        origin: process.env.FE_URL,
      },
    });
    this.socketConnec = socketIo;
  }

  SocketHandler() {
    this.socketConnec.on("connection", (socket) => {
      const room_name = socket.request.headers.referer;
      socket.join(room_name);

      socket.on("test-event", async () => {
        socket.to(room_name).emit("test-event", "test data");
      });
    });
  }
}

module.exports = Socket;
