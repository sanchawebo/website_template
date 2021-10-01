const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const sass = require("gulp-sass")(require("sass"));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require("cssnano");

const minify = require("gulp-minify");

const config = {
    srcScss: "app/src/scss/*.scss",
    srcJs: "app/src/js/*.js",
    buildHtml: "app/build",
    buildCss: "app/build/css",
    buildJs: "app/build/js",
}

// Compile .scss to .css file
function compileCSS() {
    var plugins = [
        autoprefixer(),
        cssnano(),
    ]
    return gulp
        .src(config.srcScss)
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest(config.buildCss))
        .pipe(browserSync.stream());
}

// Minify JS
function minifyJs() {
    return gulp
        .src(config.srcJs)
        .pipe(minify({
            ext: {
                min: ".min.js"
            }
        }))
        .pipe(gulp.dest(config.buildJs))
        .pipe(browserSync.stream());
}

// Watch for changes
function watchChanges() {
    browserSync.init({
        server: "./app/build",
        index: "index.html",
    });

    gulp.watch(config.buildHtml + "/*.html").on("change", browserSync.reload);
    gulp.watch(config.srcScss, compileCSS);
    gulp.watch(config.srcJs, minifyJs);
}

exports.compileCSS = compileCSS;
exports.watchChanges = watchChanges;
exports.default = watchChanges;