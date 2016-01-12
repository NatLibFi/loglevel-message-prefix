/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Plugin for loglevel which sends all messages to stderr on Node.js
 *
 * Copyright (c) 2015-2016 University Of Helsinki (The National Library Of Finland)
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 **/

(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
	define(['chai', 'loglevel', 'es6-polyfills/lib/polyfills/object', 'mockdate', '../lib/main'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('chai'), require('loglevel'), require('es6-polyfills/lib/polyfills/object'), require('mockdate'), require('../lib/main'));
    }

}(this, factory));

function factory(chai, log, Object, mock_date, loglevelMessagePrefix)
{

    'use strict';

    var expect = chai.expect;
    
    describe('main', function() {});

    it('Should be a function', function() {
	expect(loglevelMessagePrefix).to.be.a('function');
    });

    it('Should throw because argument is not an object', function() {
	expect(loglevelMessagePrefix).to.throw(Error, /Argument is not a proper loglevel object/);
    });

    it('Should throw because argument is not a proper loglevel object', function() {
	expect(function () {
	    loglevelMessagePrefix({});
	}).to.throw(Error, /Argument is not a proper loglevel object/);
    });

    it('Should return a the same loglevel object that was passed in as an argument', function() {

	var logger = log.getLogger('foo');
	var keys = Object.keys(logger);
	
	expect(loglevelMessagePrefix(logger)).to.have.all.keys(keys);

    });


    it('Should retain the original log level', function() {

	var logger = log.getLogger('foo');

	logger.setLevel('debug');

	expect(loglevelMessagePrefix(logger).getLevel()).to.equal(1);

    });

    it('Should throw an error because of invalid configuration', function() {

	var logger = log.getLogger('foo');

	expect(function() {
	    loglevelMessagePrefix(logger, {
		prefixes: 'foo'
	    });
	}).to.throw(Error, /^Invalid configuration:/);

    });

    it("Should only display a 'level' dynamic prefix", function() {

	var message,
	logger = log.getLogger('foo');

	loglevelMessagePrefix(logger, {
	    prefixes: ['level']
	}, function() {
	    return function(msg)
	    {
		message = msg;
	    };
	});

	logger.warn('TEST');

	expect(message).to.equal('[WARN]: TEST');

    });

    it("Should only display static prefixes 'foo' and 'bar'", function() {

	var message,
	logger = log.getLogger('foo');

	loglevelMessagePrefix(logger, {
	    prefixes: [],
	    staticPrefixes: ['foo', 'bar']
	}, function() {
	    return function(msg)
	    {
		message = msg;
	    };
	});

	logger.warn('TEST');

	expect(message).to.equal('[foo bar]: TEST');

    });

    it("Should display dynamic prefix 'timestamp', static prefix 'foobar' and use '/' as a separator", function() {

	var message,
	locale = 'en-US',
	timezone = 'UTC',
	date = new Date(2001, 0, 1, 1, 1, 1),
	timestamp = date.toLocaleDateString(locale, {timeZone: timezone}) + ' ' + date.toLocaleTimeString(locale, {timeZone: timezone}),
	logger = log.getLogger('foo');

	mock_date.set(date);

	loglevelMessagePrefix(logger, {
	    prefixes: ['timestamp'],
	    staticPrefixes: ['foobar'],
	    separator: '/',
	    options: {
		timestamp: {
		    locale: locale,
		    timezone: timezone
		}
	    }
	}, function() {
	    return function(msg)
	    {
		message = msg;
	    };
	});

	logger.warn('TEST');

	mock_date.reset();

	expect(message).to.equal('[' + timestamp + '/foobar]: TEST');

    });
}