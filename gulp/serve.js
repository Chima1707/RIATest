var gulp = require('gulp');

var browserSync = require('browser-sync');

var config = require('./config');

module.exports = function () {

    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.app
        }
    });

    gulp.start('watch');
}
