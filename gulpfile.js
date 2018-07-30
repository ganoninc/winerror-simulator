'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const gulpCopy = require('gulp-copy');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-image');
const rjs = require('gulp-requirejs');

gulp.task('js:buildRJSAndcompress', function() {
    return rjs({
        name: 'app',
        baseUrl: './js/',
        out: 'app.js',
    })
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/')); // pipe it to the output DIR 
});

gulp.task('img:optimize', function () {
  gulp.src('./img/*')
  .pipe(image())
  .pipe(gulp.dest('./build/img'));
});

gulp.task('css:compress', function () {
    gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('index:copy', function () {
  gulp.src('./index.html')
  .pipe(gulpCopy('./build'));
});

gulp.task('build', ['css:compress', 'js:buildRJSAndcompress', 'img:optimize', 'index:copy']);

gulp.task('sass:build', function () {
    gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/*.sass', ['sass:build']);
});

gulp.task('webserver', function() {
  gulp.src('./')
  .pipe(webserver({
      'host': '0.0.0.0'
  }));
});

gulp.task('default', ['sass:build', 'sass:watch', 'webserver']);