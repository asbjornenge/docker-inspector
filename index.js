"use strict";

var http = require("http");
var async = require("async");
var assign = Object.assign || require("object.assign");

var Inspector = function Inspector(options) {
    this.options = assign({
        all: false,
        limit: 0
    }, options);
};
Inspector.prototype = {
    inspect: function inspect(cb, id) {
        var _this = this;

        if (id) {
            return this.inspectSingleContainer(cb, id);
        }var containers = [];
        async.each(this.options.hosts, function (host, each_cb) {
            var _host = "http://" + host.host + ":" + host.port;
            get({
                host: host.host,
                port: host.port,
                path: "/containers/json?all=" + _this.options.all + "&limit=" + _this.options.limit
            }, function (err, resp, payload) {
                if (!payload) return each_cb(err);
                async.each(JSON.parse(payload), function (container, container_cb) {
                    get({
                        host: host.host,
                        port: host.port,
                        path: "/containers/" + container.Id + "/json"
                    }, function (err, resp, payload) {
                        containers.push(assign(JSON.parse(payload), { Host: host }));
                        container_cb(err);
                    });
                }, function (err) {
                    each_cb(err);
                });
            });
        }, function (err) {
            cb(err, containers);
        });
    },
    inspectSingleContainer: function inspectSingleContainer(cb, id) {
        var containers = [];
        async.each(this.options.hosts, function (host, each_cb) {
            get({
                host: host.host,
                port: host.port,
                path: "/containers/" + id + "/json"
            }, function (err, resp, payload) {
                if (!payload) return each_cb(err);
                containers.push(assign(JSON.parse(payload), { Host: host }));
                each_cb(err);
            });
        }, function (err) {
            cb(err, containers);
        });
    }
};

function get(options, callback) {
    options.method = "GET";
    var req = http.request(options, function (res) {
        var output = "";
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            output += chunk;
        });
        res.on("end", function () {
            callback(null, res, output);
        });
    });
    req.on("error", function (err) {
        callback(err, null, null);
    });
    req.end();
}

module.exports = function (options) {
    return new Inspector(options);
};

