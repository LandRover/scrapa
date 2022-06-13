import WebSocket from 'ws';


const get = async function (url, payload = {}) {
    const ws = new WebSocket(url);

    return new Promise((resolve, reject) => {
        ws.on('open', function open() {
            ws.send(JSON.stringify(payload));
        });

        ws.on('close', (code, data) => {
            const reason = data.toString();
        });

        ws.on('error', (error) => {
            reject(error);
        });

        ws.on('message', (data, isBinary) => {
            const message = isBinary ? data : data.toString();
            ws.close();

            resolve(message);
        });

    });
};


export {
    get
};
