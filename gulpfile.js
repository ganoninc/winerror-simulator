'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const pump = require('pump');
const gulpCopy = require('gulp-copy');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-image');

gulp.task('js:compress', function () {
  pump([
    gulp.src('./js/*.js'),
    uglify(),
    gulp.dest('./build/js')
    ]
    );
});

gulp.task('img:optimize', function () {
  gulp.src('./img/*')
  .pipe(image())
  .pipe(gulp.dest('./build/img'));
});

gulp.task('css:compress', function () {
    gulp.src('./sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('index:copy', function () {
  gulp.src('./index.html')
  .pipe(gulpCopy('./build'));
});

gulp.task('build', ['css:compress', 'js:compress', 'img:optimize', 'index:copy']);

gulp.task('sass:build', function () {
    gulp.src('./sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/*.sass', ['sass:build']);
});

gulp.task('webserver', function() {
  gulp.src('./')
  .pipe(webserver({
  }));
});

gulp.task('default', ['sass:build', 'sass:watch', 'webserver']);