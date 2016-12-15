import { SzJsonRpcWs, SzJsonRpcHttp } from './transport';
import { WsConnection } from './connection';

/**
 * SzJsonRpc is a factory to export JSON-RPC Client based on transport.
 * @class SzJsonRpc
 * @extends EventEmitter
 */
export default class SzJsonRpc {
  ws(engine) {
    return new SzJsonRpcWs(engine);
  }

  wsConnection(transport, url, options = {}) {
    return new WsConnection({
      transport,
      url,
      ...options
    });
  }

  http() {
    return new SzJsonRpcHttp;
  }
}

