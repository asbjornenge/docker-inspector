var http   = require('http')
var async  = require('async')
var assign = Object.assign || require('object.assign')

var Inspector = function(options) {
    this.options = assign({
        all   : false,
        limit : 0 
    }, options)
}
Inspector.prototype = {
    inspect : function(cb, id) {
        if (id) return this.inspectSingleContainer(cb, id)
        let containers = []
        async.each(this.options.hosts, (host, each_cb) => {
            let _host = `http://${host.host}:${host.port}`
            get({
                host: host.host,
                port: host.port,
                path: `/containers/json?all=${this.options.all}&limit=${this.options.limit}`
              }, (err, resp, payload) => {
                if (!payload) return each_cb(err)
                async.each(JSON.parse(payload), function(container, container_cb) {
                    get({
                      host: host.host,
                      port: host.port,
                      path: `/containers/${container.Id}/json`
                    }, (err, resp, payload) => {
                        containers.push(assign(JSON.parse(payload), { Host : host }))
                        container_cb(err)
                    })
                }, function(err) {
                    each_cb(err)
                })
            })
        }, function(err) {
            cb(err, containers)
        })
    },
    inspectSingleContainer : function(cb, id) {
        let containers = []
        async.each(this.options.hosts, (host, each_cb) => {
            get({
                host: host.host,
                port: host.port,
                path: `/containers/${id}/json`
              }, (err, resp, payload) => {
                if (!payload) return each_cb(err)
                containers.push(assign(JSON.parse(payload), { Host : host }))
                each_cb(err)
            })
        }, function(err) {
            cb(err, containers)
        })
    }
}

function get(options, callback)
{
    options.method = 'GET'
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
            callback(null, res, output);
        })
    })
    req.on('error', function(err) {
      callback(err, null, null)
    })
    req.end()
}

export default function(options) { return new Inspector(options) }
