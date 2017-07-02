/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Plugin for loglevel which allows defining prefixes for log messages
 *
 * Copyright (c) 2015-2017 University Of Helsinki (The National Library Of Finland)
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

/* istanbul ignore next: umd wrapper */
(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([
      '@natlibfi(es6-polyfills/lib/polyfills/object',
      'loglevel'
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('@natlibfi/es6-polyfills/lib/polyfills/object'),
      require('loglevel')
    );
  }

}(this, factory));

function factory(Object, log)
{

  'use strict';

  var DEFAULT_OPTIONS = {
    prefixes: ['timestamp', 'level'],
    staticPrefixes: [],
    separator: ' ',
    prefixFormat: '[%p]: ',
    options: {
      /**
       * Available options: locale (string), timezone (string), hour12 (boolean)
       */
      timestamp: {
        'hour12': false
      }
    }
  };

  return function(loglevel_obj, parameters, fn_original_factory)
  {

    function isCloneOf(obj, base)
    {
      return !Object.keys(base).some(function(key) {
        return !(obj.hasOwnProperty(key) && (typeof base[key] !== 'function' || typeof obj[key] === 'function'));
      });
    }

    function setPrefixesOptions()
    {

      timestamp_options.hour12 = parameters.options.timestamp.hour12;

      if (parameters.options.timestamp.hasOwnProperty('timezone')) {
        timestamp_options.timeZone = parameters.options.timestamp.timezone;
      }

      if (parameters.options.timestamp.hasOwnProperty('locale')) {
        timestamp_locale = [parameters.options.timestamp.locale];
      }

    }

    var timestamp_locale,
    timestamp_options = {};

    if (typeof loglevel_obj !== 'object' || !isCloneOf(loglevel_obj, log.getLogger('foo'))) {
      throw new Error('Argument is not a proper loglevel object');
    }

    fn_original_factory = typeof fn_original_factory === 'function' ? fn_original_factory : loglevel_obj.methodFactory;
    parameters = Object.assign(JSON.parse(JSON.stringify(DEFAULT_OPTIONS)), typeof parameters === 'object' ? parameters : {});

    setPrefixesOptions();

    loglevel_obj.methodFactory = function (method_name, log_level, logger_name)
    {

      var fn_method_raw = fn_original_factory(method_name, log_level, logger_name);

      return function() {

        var args, i;
        var date = new Date();
        var prefix = parameters.prefixes.reduce(function(result, prefix_name) {

          result = result.length === 0 ? result : result + parameters.separator;

          switch (prefix_name) {
          case 'timestamp':

            /**
             * @todo date.prototype.toLocaleDateString & date.prototype.toLocaleTimeString seem to modify the options argument. Tests in browsers and report to Node.js / Browser developers
             */
            if (timestamp_locale === undefined) {
              return result + date.toISOString();
            } else {
              return result + date.toLocaleDateString(timestamp_locale, JSON.parse(JSON.stringify(timestamp_options))) + ' ' + date.toLocaleTimeString(timestamp_locale, JSON.parse(JSON.stringify(timestamp_options)));
            }

            /* istanbul ignore next: Never reached because of return statements above but required by syntax */
            break;

          case 'level':
            return result + method_name.toUpperCase();
          }

        }, '');

        if (parameters.staticPrefixes.length > 0) {
          prefix = parameters.staticPrefixes.reduce(function(result, prefix_static) {

            result = result.length === 0 ? result : result + parameters.separator;

            return result + prefix_static;

          }, prefix);
        }

        prefix = parameters.prefixFormat.replace(/%p/, prefix);
        args = [prefix];
        for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        fn_method_raw.apply(this, args);

      };

    };

    loglevel_obj.setLevel(loglevel_obj.getLevel());

    return loglevel_obj;

  };

}
