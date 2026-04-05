class BaseRequest {
  #loaded = false;
  #url = null;
  #payload = null;
  #body = null;
  #statusCode = 0;
  #proxy = null;
  #headers = null;


  constructor() {}

  loadingCompleted() {
    this.#loaded = true;

    return this;
  }


  serialize() {
    return {
      url: () => this.getURL(),
      body: () => this.getBody(),
      statusCode: () => this.getStatusCode(),
    };
  }


  getURL() {
    return this.#url;
  }


  setURL(url) {
    this.#url = url;

    return this;
  }


  getBody() {
    return this.#body;
  }


  setBody(body) {
    this.#body = body;

    return this;
  }


  getStatusCode() {
    return this.#statusCode;
  }


  setStatusCode(statusCode) {
    this.#statusCode = statusCode;

    return this;
  }


  getPayload() {
    return this.#payload;
  }


  setPayload(payload) {
    this.#payload = payload;

    return this;
  }


  getProxy() {
    return this.#proxy;
  }


  setProxy(proxy) {
    this.#proxy = proxy;

    return this;
  }


  getHeaders() {
    return this.#headers;
  }


  setHeaders(headers) {
    this.#headers = headers;

    return this;
  }


  load() {
    throw 'OVERRIDE';
  }


  reduceRegExp(regExpList = []) {
    // regex, extract interesting parts
    for (let i = 0, len = regExpList.length; i < len; i++) {
        let pattern = regExpList[i];

        if (pattern instanceof RegExp) {
            let res = pattern.exec(this.#body);

            if (res !== null && undefined !== res[1]) {
                this.#body = res[1];
            }
        }
    }

    return this;
  }


}


export default BaseRequest;
