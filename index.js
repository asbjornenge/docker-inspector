var async   = require('async')
var request = require('request')

var Inspector = function(options) {
    this.options = options
}
Inspector.prototype = {
    inspect : function(cb, id) {
        async.each(this.options.hosts, function(host, each_cb) {
            request('http://'+host.host+':'+host.port+'/containers/json', function(err, resp, payload) {
                console.log(JSON.parse(payload).length)
                each_cb(null)
            })
        }, function(err) {
            console.log('finished each')
            cb(err)
        })
    },
    inspectSingleContainer : function(cb, id) {

    }
}

module.exports = function(options) { return new Inspector(options) }
