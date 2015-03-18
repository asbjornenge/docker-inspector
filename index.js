"use strict";

var async = require("async");
var request = require("request");
var assign = Object.assign || require("object.assign");

var Inspector = function Inspector(options) {
    this.options = options;
};
Inspector.prototype = {
    inspect: function inspect(cb, id) {
        if (id) {
            return this.inspectSingleContainer(cb, id);
        }var containers = [];
        async.each(this.options.hosts, function (host, each_cb) {
            var _host = "http://" + host.host + ":" + host.port;
            request("" + _host + "/containers/json", function (err, resp, payload) {
                if (!payload) return each_cb(err);
                async.each(JSON.parse(payload), function (container, container_cb) {
                    request("" + _host + "/containers/" + container.Id + "/json", function (err, resp, payload) {
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
            request("http://" + host.host + ":" + host.port + "/containers/" + id + "/json", function (err, resp, payload) {
                if (!payload) return each_cb(err);
                containers.push(assign(JSON.parse(payload), { Host: host }));
                each_cb(err);
            });
        }, function (err) {
            cb(err, containers);
        });
    }
};

module.exports = function (options) {
    return new Inspector(options);
};

