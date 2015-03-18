# docker inspector

Inspect one or all docker containers on one or more hosts.

## Install

```sh
npm install --save docker-inspector
```

## Use

```js
var inspector = require('docker-inspector')({
    hosts : [{
        host : <ip>,
        port : <port>
    }]
})
inspector.inspect(function(err, containers) {})       // => Inspect all
inspector.inspect(function(err, containers) {},<id>)  // => Inspect id
```

## Options

```
hosts    // List of hosts to query                (required      -> at least one)
all      // Return all or only running containers (default false -> only running)
limit    // Max number of containers              (default 0     -> no limit)
```

## Changelog

### 1.1.0

* Added support for option *all*
* Added support for option *limit*

### 1.0.1

* Fixed missing Object.assign for "old" environments

### 1.0.0

* Initial realase :tada:

enjoy
