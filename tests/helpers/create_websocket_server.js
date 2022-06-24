import { WebSocketServer } from 'ws';
import { Server } from 'http';

const groupNames = [];

function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', function (webSocket) {
    webSocket.on('message', function (message) {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'ECHO': {
          webSocket.send(data.value);
          break;
        }

        case 'ECHO_TIMES_3': {
          for (let i = 1; i <= 3; i++) {
            webSocket.send(data.value);
          }
          break;
        }

      }
    });
  });
}

export default createWebSocketServer;
