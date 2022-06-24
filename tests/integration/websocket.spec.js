import Websocket from '../../src/lib/http/websocket.js';
import { startServer, waitForSocketState, createSocketClient } from '../helpers/websocket_test_utils';

const port = 3000;

// 'When no price is specified, then the product status is pending approval'
describe('Websocket', function() {


    describe('get data from websocket', function () {
        let server;

        beforeAll(async () => {
            server = await startServer(port);
        });

        afterAll(() => server.close());

        it('When making an WS call to localhost, should retrieve a valid response from socket', async function () {
            const url = `ws://localhost:${port}`,
                  payload = {
                    type: 'ECHO',
                    value: 'This is a test message'
                  };

            // Act
            let sut = (await (new Websocket())
                    .setURL(url)
                    .setPayload(payload)
                    .load()
                )
                .serialize();

            console.log(sut.body());

            // Assert
            expect(sut.body()).toContain(payload.value);
        });


    });
});