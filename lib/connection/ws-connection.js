import _ from 'lodash';
import { SzJsonRpcWs } from '../transport';

export default class WsConnection {
  constructor(options = {}) {
    if (!_.has(options, 'transport'))
      throw "transport required.";

    if (!_.has(options, 'url'))
      throw "url required";
    
    this.transport = options.transport;
    this.url = options.url;
    this.options = { ...options };
    this.queue = [];
    this.keepAliveTimeout = null;
    this.keepAliveDelta = 1000;
    this.keepAliveRetry = 0;

    this.getSocket();
  }

  getSocket() {
    if (!this.socketReady()) {
      // No socket, or dying socket, let's get a new one
      const ws = new this.transport(this.url);
      this.curSocket = new SzJsonRpcWs(ws);
      this.setupSocket();
      return this.curSocket;
    }
  }

  setupSocket() {
    this.curSocket.on('open', () => {
      if (this.keepAliveTimeout)
        clearTimeout(this.keepAliveTimeout);

      this.keepAliveDelta = 1000;
      this.keepAliveRetry = 0;

      if (this.options.onWSConnect
          && typeof(this.options.onWSConnect) === 'function')
        this.options.onWSConnect(this.curSocket);

      this.queue = _.reduce(this.queue, (acc, value) => {
        this.send(value.method, value.params, value.id);
      });
    });

    this.curSocket.on('close', (reason) => {
      if (this.options.onWSClose)
        this.options.onWSClose(this.curSocket);

      this.keepAliveTimeout = setTimeout(() => {
        console.info('Retrying Connection...');
        this.getSocket();
      }, this.keepAliveDelta);

      this.keepAliveRetry++;

      if (this.keepAliveDelta < 3000 && (this.keepAliveRetry % 10) === 0)
        this.keepAliveDelta += 1000;
    });
  }

  send(method, params, id, callback) {
    if (!this.socketReady()) {
      const sendParams = { method, params, id };
      this.queue.push(sendParams);
      return sendParams;
    }
    return this.curSocket.request(method, params, id)(callback);
  }

  socketReady() {
    return _.isNull(this.curSocket) || (this.curSocket && this.curSocket.readyState > 1);
  }
}
