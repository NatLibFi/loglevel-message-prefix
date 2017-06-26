module.exports = function(config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'requirejs'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'test/browser-main.js': 'requirejs'
    },
    requirejsPreprocessor: {
      config: {
        baseUrl: '/base'
      },
      testRegexp: '^/base/test/.+\.spec\.js$'
    },
    files: [
      'test/browser-main.js',
      {
        pattern: 'test/**/*.spec.js',
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
