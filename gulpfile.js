'use strict';

var gulp = require('gulp'),
watch = require('gulp-watch'),
prefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
rigger = require('gulp-rigger'),
cssmin = require('gulp-minify-css'),
rimraf = require('rimraf'),
browserSync = require('browser-sync'),
reload = browserSync.reload;


var path = {

build: { 
html: 'build/',
js: 'build/js/',
css: 'build/css/',
img: 'build/img/',
fonts: 'build/fonts/'
},
src: { 
html: 'src/*.html',
js: 'src/js/main.js',
style: 'src/style/main.scss',
img: 'src/img/*',
fonts: 'src/fonts/*'
},
watch: { 
html: 'src/**/*.html',
js: 'src/js/**/*.js',
style: 'src/style/**/*.scss',
img: 'src/img/*',
fonts: 'src/fonts/*'
},
clean: './build'
};

gulp.task("webserver", function (done) {

    browserSync({
    server:{
        baseDir: "./build"
    },
    host: 'localhost',
    port: 3000
    });
    done();
});

gulp.task('html:build', function (done) {
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true}));
    done();
});    

gulp.task('js:build', function(done) {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('style:build', function(done) {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
    done();
});
gulp.task('img:build', function(done) {
    gulp.src(path.src.img)        
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
    done();
});
gulp.task('fonts:build', function(done) {
    gulp.src(path.src.fonts)        
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
    done();
});

gulp.task('build', gulp.parallel('html:build',
'js:build',
'style:build','img:build','fonts:build'));

gulp.task('watch:js', function(done) {
    gulp.watch([path.watch.js], gulp.series(['js:build']));   
    done();
});
gulp.task('watch:html', function(done) {    
    gulp.watch([path.watch.html], gulp.series(['html:build']));
    done();
});
gulp.task('watch:style', function(done) {
    gulp.watch([path.watch.style], gulp.series(['style:build']));
    done();
});
gulp.task('watch:img', function(done) {
    gulp.watch([path.watch.img], gulp.series(['img:build']));
    done();
});
gulp.task('watch:fonts', function(done) {
    gulp.watch([path.watch.fonts], gulp.series(['fonts:build']));
    done();
});

gulp.task('watch', gulp.parallel('watch:js', 'watch:html', 'watch:style', 'watch:img', 'watch:fonts'));


gulp.task('clean', function(callback){
    rimraf(path.clean, callback);
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));