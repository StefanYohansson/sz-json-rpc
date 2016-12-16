import _ from 'lodash';
import EventEmitter from 'wolfy87-eventemitter';
import * as Utils from '../utils';

export default class SzJsonRpcWs extends EventEmitter {
  constructor(socket = null, options = {}) {
    super();

    if (_.isNull(socket))
      throw "You need to specify a socket.";

    const defaults = {
      version: 2,
      generator: Utils.generateId
    };
    this.socket = socket;
    this.options = {
      ...defaults,
      ...options
    };
    
    this.setupListeners();
  }

  updateSocket(socket) {
    this.socket = socket;
    this.setupListeners();
  }

  setupListeners() {
    if (!this.socket.on) {
      this.socket.on = (event, callback) => {
        this.socket[`on${event}`] = callback;
      };
    }
    this.socket.on('open', () => this.emit('open'));
    this.socket.on('close', (reason) => this.emit('close', reason));
    this.socket.on('error', () => this.emit('error'));
    this.socket.on('message', (message) => {
      const { data } = message;
      const dataT = JSON.parse(data);
      this.emit(dataT.id, dataT);
      this.emit('message', message);
      return false;
    });
  }

  /**
   *  Creates a request and dispatches it if given a callback.
   *  @param {String|Array} method A batch request if passed an Array, or a method name if passed a String
   *  @param {Array|Object} params Parameters for the method
   *  @param {String|Number} [id] Optional id. If undefined an id will be generated. If null it creates a notification request
   *  @param {Function} [callback] Request callback. If specified, executes the request rather than only returning it.
   *  @throws {TypeError} Invalid parameters
   *  @return {Object} JSON-RPC 1.0 or 2.0 compatible request
   */
  request(method, params, id) {
    return callback => {
      let request;

      if (typeof(id) === 'function') {
        callback = id;
        id = undefined; // specifically undefined because "null" is a notification request
      }

      var hasCallback = typeof(callback) === 'function';

      try {
        request = Utils.request(method, params, id, {
          generator: this.options.generator,
          version: this.options.version
        });
      } catch(err) {
        if (hasCallback) return callback(err);
        throw err;
      }

      this.emit('request', request);
      this._request(request, callback);

      return request;
    };
  }

  send(method, params, callback) {
    if (!_.isFunction(callback))
      callback = () => {};
    this.request(method, params, undefined)(callback);
  }

  _request(request, callback) {
    this.socket.send(JSON.stringify(request));
    this.once(request['id'], this._parseResponse(callback, request));
  }

  _parseResponse(callback, request) {
    return response => {
      if (!response || typeof(response) !== 'object')
        return callback(null, null, request);

      return callback(response.error, response.result, request);
    };
  }

  close() {
    this.removeAllListeners();
    this.socket.close();
  }
}

