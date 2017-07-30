// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var sourcePreprocessors = ['coverage']

function isDebug () {
  return process.argv.indexOf('--debug') >= 0
}

if (isDebug()) {
    // Disable JS minification if Karma is run with debug option.
  sourcePreprocessors = []
}

module.exports = function (config) {
  config.set({
        // base path, that will be used to resolve files and exclude
    basePath: 'test/'.replace(/[^/]+/g, '..'),

        // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
    files: [
            // bower:js

      'src/bower_components/angular/angular.js',

      'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

      'src/bower_components/angular-ui-router/release/angular-ui-router.js',

      'src/bower_components/jquery/dist/jquery.js',

      'src/bower_components/localforage/dist/localforage.js',

      'src/bower_components/angular-localforage/dist/angular-localForage.js',

      'src/bower_components/angular-ui-select/dist/select.js',

      'src/bower_components/angular-sanitize/angular-sanitize.js',

      'src/bower_components/d3/d3.js',

      'src/bower_components/nvd3/build/nv.d3.js',

      'src/bower_components/angular-mocks/angular-mocks.js',

      'src/bower_components/bootstrap/dist/js/bootstrap.js',

      'src/bower_components/angular-nvd3/dist/angular-nvd3.js',

      // endbower
      'src/app/app.module.js',
      'src/app/app.constants.js',
      'src/app/**/*.+(js|html)',
      'test/**/!(karma.conf).js'
    ],

        // list of files / patterns to exclude
    exclude: [],

    preprocessors: {
      './**/*.js': []
    },

    reporters: ['coverage', 'spec'],

        // web server port
    port: 9876,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
    browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
    singleRun: true

  })
}
