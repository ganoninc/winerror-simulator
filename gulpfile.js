const { watch, parallel, series, src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const gulpCopy = require('gulp-copy');
const cleanCSS = require('gulp-clean-css');
// TODO fix image() import / call 
// const image = require('gulp-image');
const rjs = require('gulp-requirejs');


function jsBuildRJSAndcompress() {
  return rjs({
    name: "app",
    baseUrl: "./js/",
    out: "app.js",
  })
    .pipe(uglify())
    .pipe(dest("./build/js/"));
}

function imgOptimize() {
  // TODO fix image() import / call 
  // return src("./img/*").pipe(image()).pipe(dest("./build/img"));
  return src("./img/*").pipe(dest("./build/img"));
}

function cssCompress() {
  return src("./sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({}))
    .pipe(dest("./build/css"));
}

function indexCopy() {
  return src("./index.html").pipe(gulpCopy("./build"));
}

exports.build = series(
  cssCompress,
  jsBuildRJSAndcompress,
  imgOptimize,
  indexCopy
);

function sassBuild() {
  return src("./sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./css"));
}

function sassWatch() {
  return watch("./sass/*.sass", sassBuild);
}

function webServer() {
  return src("./").pipe(
    webserver({
      host: "localhost",
    })
  );
}

exports.dev = series(
  sassBuild,
  parallel(
    sassWatch,
    webServer
  )
);