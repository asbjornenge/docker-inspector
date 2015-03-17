# docker inspector

Inspect one or all docker containers on one or more hosts.

## Install

```sh
npm install --save docker-inspector
```

## Use

```js
var inspector = require('docker-inspector')({hosts:[<host>]})
inspector.inspect(function(err, containers) {})       // => Inspect all
inspector.inspect(function(err, containers) {},<id>)  // => Inspect id
```

## Options

```
hosts    // List of hosts to query
```

### Hosts format

```
{
    host : <ip>,
    port : <port>
}
```

enjoy
