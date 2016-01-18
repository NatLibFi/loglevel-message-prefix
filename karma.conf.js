module.exports = function(config) {
    config.set({
	singleRun: true,
	frameworks: ['mocha', 'requirejs'],
	browsers: ['PhantomJS'],
	files: [
	    'test/browser/main.js',
	    {
		pattern: 'test/**/*.spec.js',
		included: false
	    },
	    {
		pattern: 'resources/**/*.json',
		included: false
	    },
	    {
		pattern: 'lib/**/*.js',
		included: false
	    },
	    {
		pattern: 'node_modules/**/*.js',
		included: false
	    }
	]
    });
};