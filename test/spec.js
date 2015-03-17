var assert    = require('assert')
var inspector = require('../index')({ hosts: [{ host : "127.0.0.1", port : 4243 }]})

it('can inspect all containers on a host', function(done) {
    inspector.inspect(function(err, containers) {
        done()
    })
})
