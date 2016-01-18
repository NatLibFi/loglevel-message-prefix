(function() {

    'use strict';

    function formatPath(path) {
	return path.replace(new RegExp('^/base/'), '').replace(/\.js$/, '');
    }

    var spec_list = [];
    
    Object.keys(window.__karma__.files).forEach(function(file) {
	if (new RegExp('^/base/test/').test(file) === true && new RegExp('spec\.js$', 'i').test(file) === true) {
	    spec_list.push(formatPath(file));
	}
    });
    
    require.config({
	baseUrl: '/base',
	paths: {
	    'chai': 'node_modules/chai/chai',
	    'loglevel': 'node_modules/loglevel/lib/loglevel',
	    'mockdate': 'node_modules/mockdate/src/mockdate',
	    'es6-polyfills': 'node_modules/es6-polyfills',
	    'jjv': 'node_modules/jjv/lib/jjv',
	    'jjve': 'node_modules/jjve/jjve',
	    'es6-object-assign': 'node_modules/es6-polyfills/node_modules/es6-object-assign',
	    "json": "node_modules/requirejs-plugins/src/json",
	    "text": "node_modules/requirejs-plugins/lib/text"
	},
	deps: spec_list,
	callback: window.__karma__.start
    });
    
})();