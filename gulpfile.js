const gulp = require("gulp");
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const browserSync = require("browser-sync").create();

const sass = require("gulp-sass")(require("sass"));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require("cssnano");

const minify = require("gulp-minify");

const config = {
    srcHtml: "app/src/pages/**/*.+(html|njk)",
    srcHtmlTmplt: "app/src/templates",
    srcScss: "app/src/scss/*.scss",
    srcJs: "app/src/js/*.js",
    buildHtml: "app/build",
    buildCss: "app/build/css",
    buildJs: "app/build/js",
}
// Render html nunjuck files
function renderNunjucks() {
    return gulp
        .src(config.srcHtml)
        .pipe(data(function() {
            return require('./app/src/data.json')
        }))
        .pipe(nunjucksRender({
            path: [config.srcHtmlTmplt]
        }))
        .pipe(gulp.dest(config.buildHtml))
        .pipe(browserSync.stream());
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

    gulp.watch(config.srcHtml, renderNunjucks);
    gulp.watch(config.srcScss, compileCSS);
    gulp.watch(config.srcJs, minifyJs);
}

exports.renderNunjucks = renderNunjucks;
exports.compileCSS = compileCSS;
exports.watchChanges = watchChanges;
exports.default = watchChanges;