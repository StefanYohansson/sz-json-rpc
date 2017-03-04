const chai = require('chai')
const _ = require('lodash')
import SzJsonRpc from '../dist/sz-json-rpc'
import { WebSocket, Server } from 'mock-socket';

const assert = chai.assert.equal

describe("Factory", () => {
  it('should get factory instance', () => {
    const socketF = new SzJsonRpc

    assert(_.isObject(socketF), true)
    assert(socketF instanceof SzJsonRpc, true)
  })

  it('should get websocket instance', (done) => {
    const mockServer = new Server('ws://localhost:5000');
    mockServer.on('message', (message) => {
      const messageT = JSON.parse(message);
      assert(messageT.method, 'login');
      assert(messageT.jsonrpc, '2.0');

      mockServer.send(JSON.stringify(
        {
          "jsonrpc": "2.0",
          "error": {"code": -32000, "message": "Authentication"},
          "id": messageT.id
        }
      ));

    });

    const socket = new SzJsonRpc()
                    .wsConnection(WebSocket, 'ws://localhost:5000').getSocket();
    socket.send(
      'login',
      { sessid: "e590bdf6-24fb-21d3-2114-47c9242d2664" },
      (err, response, request) => done()
    );
  })
})
