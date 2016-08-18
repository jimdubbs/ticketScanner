'use strict';

// Load plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stripdebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var minify = require('gulp-minify');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');
var del = require('del');
var jscs = require('gulp-jscs');
var run = require('gulp-run');
var exec = require('child_process').exec;
var exit = require('gulp-exit');
var templateCache = require('gulp-angular-templatecache');
//Error function for plumber *not used yet
var onError = function (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
};

//Build datestamp for cache busting
var getStamp = function () {
    var myDate = new Date();

    var myYear = myDate.getFullYear().toString();
    var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
    var myDay = ('0' + myDate.getDate()).slice(-2);
    var mySeconds = myDate.getSeconds().toString();

    var myFullDate = myYear + myMonth + myDay + mySeconds;

    return myFullDate;
};

//Clean dist folder
gulp.task('clean', function () {
    return del(['./public/dist']).then(function (paths) {
        console.log('Deleted files and folders:' + paths.join('\n'));
    })
});

// JSCS
gulp.task('jscs', function () {
    return gulp.src(['./public/**/*.js', '!./public/common/resources/*.js'])
        .pipe(jscs({ fix: true }))
        .pipe(jscs.reporter('jscs-stylish'))
        .pipe(jscs.reporter('fail'))
        .pipe(gulp.dest('./public'))
    // .pipe(notify({ message: 'JSCS task complete' }));
});

// Lint JS task
gulp.task('jshint', function () {
    return gulp.src(['./public/**/*.js', '!./public/common/resources/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
    // .pipe(notify({ message: 'Lint task complete' }));
});

//Build Template Cache
gulp.task('templateCache', function () {
    var options = {};
    options.standalone = true;
    options.module = 'templates';
    options.base = 'public/dist'
    return gulp.src(['public/**/*.html', '!public/index.html', '!./public/common/resources'])
        .pipe(templateCache('templates.js', options))
        .pipe(gulp.dest('public'));
});

//Concatenate and Minify JS task
gulp.task('annotate', function () {
    return gulp.src(['./public/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./public/dist/annotate'))
    // .pipe(notify({ message: 'Script annotation complete' }));
});

gulp.task('removeAnnotate', function () {
    return del(['./public/dist/annotate']).then(function (paths) {
        console.log('Deleted annotated files:' + paths.join('\n'));
    })
});

gulp.task('concat', function () {
    return gulp.src('./public/dist/annotate/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/dist'))
    // .pipe(notify({ message: 'Script concat complete' }));
});

gulp.task('compress', function () {
    return gulp.src('./public/dist/all.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: [],
            ignoreFiles: []
        }))
        .pipe(gulp.dest('./public/dist'))
    // .pipe(notify({ message: 'Script compression complete' }));
});

// Cache busting task
gulp.task('cachebust', function () {
    return gulp.src('./public/index.html')
        .pipe(replace(/all.min.js\?([0-9]*)/g, 'all.min.js?' + getStamp()))
        .pipe(replace(/all.js\?([0-9]*)/g, 'all.js?' + getStamp()))
        .pipe(gulp.dest('./public'))
    // .pipe(notify({ message: 'CSS/JS Cachebust complete' }));
});

gulp.task('start-server', function () {
    var userProfile = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

    if (process.platform == 'win32') {
        run(userProfile + '\\.vscode\\extensions\\quorum-vscode-ext\\startServers.bat').exec().pipe(exit());
    }
    else {
        exec(userProfile + '/.vscode/extensions/quorum-vscode-ext/stopServers.sh', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            exec(userProfile + '/.vscode/extensions/quorum-vscode-ext/startServers.sh', function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
            });
        });

    }
})

//Final Tasks
gulp.task('build', function (callback) {
    runSequence('clean', 'annotate', 'concat', 'compress', 'removeAnnotate', 'cachebust', 'start-server', callback);
});

gulp.task('lintBuild', function (callback) {
    runSequence('clean', 'jscs', 'annotate', 'concat', 'compress', 'removeAnnotate', 'cachebust', callback);
});