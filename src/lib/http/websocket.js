import BaseRequest from './base_request.js';

import WebSocket from 'ws';

class Websocket extends BaseRequest {

    async load() {
        const h = this.getHeaders();
        const wsOptions = h && Object.keys(h).length > 0 ? { headers: h } : undefined;
        const ws = new WebSocket(this.getURL(), wsOptions);

        return new Promise((resolve, reject) => {
            ws.on('open', () => {
                ws.send(JSON.stringify(this.getPayload()));
            });

            ws.on('close', (code, data) => {
                const reason = data.toString();
            });

            ws.on('error', (error) => {
                reject(error);
            });

            ws.on('message', (data, isBinary) => {
                const body = isBinary ? data : data.toString();
                ws.close();

                this.setBody(body);
                this.setStatusCode(200);
                this.loadingCompleted();

                resolve(this);
            });

        });
    }

}


export default Websocket;
