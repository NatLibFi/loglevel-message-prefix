/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Plugin for loglevel which allows defining prefixes for log messages
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
	define(['es6-polyfills/lib/object', 'loglevel', 'jjv', 'jjve', '../resources/parameters-schema.json'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('es6-polyfills/lib/object'), require('loglevel'), require('jjv'), require('jjve'), require('../resources/parameters-schema.json'));
    } else {
	root.loglevelMessagePrefix = factory(root.Object, root.log, root.jjv, root.jjve, root.loglevelMessagePrefixParametersSchema);
    }

}(this, factory));

function factory(Object, log, jjv, jjve, schema)
{
    
    'use strict';

    return function(loglevel_obj, parameters)
    {

	function validateParameters()
	{

	    var env = jjv();
	    var je = jjve(env);
	    var errors = env.validate(schema, parameters, {
		useDefault: true
	    });

	    if (errors) {
		throw new Error(JSON.stringify(je(schema, parameters, errors), undefined, 4));
	    }

	}
		
	function isInstanceOf(obj, proto)
	{

	    function getKeys(subject)
	    {
		return Object.keys(obj).filter(function(key) {
		    return ['getLogger', 'noConflict'].indexOf(key) < 0;
		});
	    }

	    return getKeys(obj).length === getKeys(proto).length;

	}

	var originalFactory;

	if (!isInstanceOf(loglevel_obj, log)) {
	    throw new Error('Argument is not an instance of loglevel');
	}

	originalFactory = loglevel_obj.methodFactory;
	parameters = typeof parameters === 'object' ? parameters : {};
	validateParameters();

	loglevel_obj.methodFactory = function (method_name, log_level, logger_name)
	{

	    var fn_raw_log_method = originalFactory(method_name, log_level, logger_name);

	    return function(message) {

		var date = new Date();
		var prefix = '[' + parameters.prefixes.reduce(function(result, prefix_name) {
		    switch (prefix_name) {
		    case 'timestamp':
			return result + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + parameters.separator;
		    case 'level':
			return result + method_name.toUpperCase() + parameters.separator;
		    }
		}, '');

		if (parameters.staticPrefixes.length > 0) {
		    prefix = parameters.staticPrefixes.reduce(function(result, prefix_static) {
			return result + prefix_static;
		    }, prefix);
		} else {
		    prefix = prefix.substr(0, prefix.length - 1);		    
		}

		fn_raw_log_method(prefix + ']: ' + message);

	    };

	};

	loglevel_obj.setLevel(loglevel_obj.getLevel());	

    };

}