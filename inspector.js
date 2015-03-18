var async   = require('async')
var request = require('request')
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
            request(`${_host}/containers/json?all=${this.options.all}&limit=${this.options.limit}`, (err, resp, payload) => {
                if (!payload) return each_cb(err)
                async.each(JSON.parse(payload), function(container, container_cb) {
                    request(`${_host}/containers/${container.Id}/json`, (err, resp, payload) => {
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
            request(`http://${host.host}:${host.port}/containers/${id}/json`, (err, resp, payload) => {
                if (!payload) return each_cb(err)
                containers.push(assign(JSON.parse(payload), { Host : host }))
                each_cb(err)
            })
        }, function(err) {
            cb(err, containers)
        })
    }
}

export default function(options) { return new Inspector(options) }
