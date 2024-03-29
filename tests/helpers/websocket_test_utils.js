import http from 'http';
import createWebSocketServer from './create_websocket_server.js';

function startServer(port) {
  const server = http.createServer();

  createWebSocketServer(server);
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}


function waitForSocketState(socket, state) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}


async function createSocketClient(port, closeAfter) {
  const client = new WebSocket(`ws://localhost:${port}`);

  await waitForSocketState(client, client.OPEN);

  const messages = [];

  client.on('message', (data) => {
    messages.push(data);
    if (messages.length === closeAfter) {
      client.close();
    }
  });

  return [client, messages];
}

export { startServer, waitForSocketState, createSocketClient };
