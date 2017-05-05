'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    notify = require('gulp-notify'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/static/js/',
        css: 'build/static/css/',
        img: 'build/static/img/',
        fonts: 'build/static/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/static/js/**/*.js',
        style: 'src/static/css/**/*.css',
        img: 'src/static/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/static/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/static/js/**/*.js',
        style: 'src/static/css/**/*.css',
        img: 'src/static/img/**/*.*',
        fonts: 'src/static/fonts/**/*.*'
    },
    clean: './build'
};
/*Настройки локального сервера*/

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Kiel_Hyre"
};

//Сборка HTML
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//Сборка JS
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

//Сборка CSS
gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}))
        .pipe(notify( 'Так держать Владуха!' ) );

});


//Сборка картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

//Сборка шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

//Собираем все вместе
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

//Добавляем Watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

//BrowserSync
gulp.task('webserver', function () {
    browserSync(config);
});

//Очистка картинок
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

//Запускаем все вместе
gulp.task('default', ['build', 'webserver', 'watch']);

