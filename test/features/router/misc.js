'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

var assert = require('../../utils/assert.js');
var preq = require('preq');
var request_parser = require('../../../lib/proxyHandler.js');

module.exports = function (config) {
    
    describe('router - misc', function() {
        it('should deny access to /{domain}/sys', function() {
            return preq.get({
                uri: config.hostPort + '/en.wikipedia.org/sys/table'
            }).catch(function(err) {
                assert.deepEqual(err.status, 403);
            });
        });
    });
    describe('request templating handler', function() {
        it('should create code out of template', function() {
            var evaluator = new request_parser().eval_request;
            // pass a template which uses parent request
            var e = evaluator("$request");
            assert.deepEqual(e({uri:'/foo/bar'}), {uri:'/foo/bar'})
            
            // pass a template with basic uri
            e = evaluator({
                uri:'/foobar/bar',
            });
            assert.deepEqual(e({uri:'/foo/bar'}), {});
            
            // pass a template with basic uri and header
            e = evaluator({
                uri:'/foobar/bar',
                header: '$request.header'
            });
            assert.deepEqual(
                e({ uri: '/foo/bar', header: {'foo': 'foobar'} }), 
                {header: {'foo': 'foobar'}}
            );
        });
    });
};
