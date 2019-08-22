/* PROJECT STRUCTURE
src/
    js/
    lib/
    scss/
    img/
    index.html
 dist/
 gulpfile.js
*/
const gulp = require("gulp"); // загрузить локальный галп === подключить библиотеку
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
var clean = require('gulp-clean');

gulp.task("html", () => {
    // загрузить файл в память
    // выгрузить его в другую директорию
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist")) // только путь, но не название
        .pipe(browserSync.stream());
});

gulp.task("scss", () => {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("js", () => {
    return gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
});

gulp.task("browser-init", () => {
    return browserSync.init({
        server: "./dist"
    });
})

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    gulp.watch("./src/img/**/*", gulp.series("images"));
    done();
});

gulp.task("images", () => {
    return gulp.src("./src/img/**/*")
        .pipe(cache(
            imagemin([
                imageminPngquant({ quality: [0.3, 0.5] })
            ])
        ))
        .pipe(gulp.dest("./dist/img"));
});

gulp.task("clean", () => {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("html", "scss", "js", "images")
));

gulp.task("default", gulp.series("html", "scss", "js", "images", "watch", "browser-init"));

