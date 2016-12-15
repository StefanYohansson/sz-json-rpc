<p align="center">
  <b>sz-json-rpc</b>
  <br><br>
  <img width="45" src="https://raw.githubusercontent.com/StefanYohansson/sz-dotfiles/master/8bheart.png">
  <br/><br/>
  <small>JSON-RPC that works on browser.</small>
</p>

#### Installation

```
  $ npm install sz-json-rpc --save
```

#### Example

* Using json-rpc adapter to send requests.

```javascript
var webSocket = new WebSocket('ws://localhost:5000');
var ws = new SzJsonRpc().ws(webSocket);
ws.on('open', () => {
  ws.request('ping')((err, response) => {
    if (err) throw err;
    console.log('response', response);
  });
});
ws.on('close', (reason) => {
  // this will not show when onbeforeunload event call .close
  console.log('close', reason);
});
window.onbeforeunload = function() {
  ws.close();
}
```

* Using connector to do some tricks like auto reconect, queue requests when socket isn't ready and dispatch when it is live.

```javascript
const conn = new SzJsonRpc().wsConnection(WebSocket, 'ws://localhost:5000', {
  onWSConnect: (ws) => {
    ws.send('login', {}, (err, response) => {
      if(err)
        console.error(err);
    });
    ws.send('ping', null, (err, response) => {
      console.log(response);
    });
  }
});

window.onbeforeunload = function() {
  if (conn.socketReady())
    conn.curSocket.close();
}
```
