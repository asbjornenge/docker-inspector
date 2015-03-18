var assert    = require('assert')
var inspector = require('../inspector')({ hosts: [{ host : "127.0.0.1", port : 4243 }]})
var broken    = require('../inspector')({ hosts: [{ host : "127.0.0.1", port : 4443 }]})

it('can inspect all containers across hosts', (done) => {
    inspector.inspect((err, containers) => {
        assert(err == null)
        assert(containers instanceof Array)
        assert(containers.length > 1)
        done()
    })
})

it('can inspect a single container id across hosts', (done) => {
    inspector.inspect((err, containers) => {
        assert(err == null)
        assert(containers instanceof Array)
        assert(containers.length == 1)
        done()
    }, 'dispatcher')
})

it('will return err if err for multiple', (done) => {
    broken.inspect((err, containers) => {
        assert(err != null)
        done()
    })
})

it('will return err if err for multiple', (done) => {
    broken.inspect((err, containers) => {
        assert(err != null)
        done()
    },'dispatcher')
})
