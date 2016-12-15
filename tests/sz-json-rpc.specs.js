const chai = require('chai')
const _ = require('lodash')
import SzJsonRpc from '../dist/sz-json-rpc'
import { WebSocket } from 'mock-socket';

const assert = chai.assert.equal

describe("Factory", () => {
  it('should get factory instance', () => {
    const socketF = new SzJsonRpc

    assert(_.isObject(socketF), true)
    assert(socketF instanceof SzJsonRpc, true)
  })
})
