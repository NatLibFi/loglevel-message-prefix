module.exports = function(grunt)
{

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.initConfig({

	jshint: {
	    options: {
		jshintrc: true
	    },
	    src: '.'
	},
	mochaTest: {
	    test: {
		src: [ 'test/*.spec.js' ]
	    }
	},
	mocha_istanbul: {
	    src: 'test',
	    options: {
		check: {
		    lines: 80,
		    statements: 80,
		    functions: 80,
		    branches: 80
		}
	    }
	}

    });

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('default', [
	'lint',
	'test',
	'coverage'
    ]);

};