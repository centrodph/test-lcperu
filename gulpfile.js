var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var fileinclude = require('gulp-file-include');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var reload = browserSync.reload;

const config = {
    jsbase: './src/assets/js/*.js',
    lessbase: './src/assets/css/*.less',
    less: './src/assets/css/modules/*.less',
    css: './build/assets/css/'
};
const cssDeps = ['./node_modules/bootstrap/dist/css/bootstrap.css', './node_modules/select2/dist/css/select2.css'];
const jsDeps = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/select2/dist/js/select2.js',
    './node_modules/select2/dist/js/i18n/es.js'
];

/**
 * install css dependencies
 */
gulp.task('deps-css', function() {
    return gulp
        .src(cssDeps)
        .pipe(concat('lib.css'))
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(cleanCss())
        .pipe(gulp.dest('./build/assets/css/'));
});
/**
 * install js dependencies
 */
gulp.task('deps-js', function() {
    return gulp
        .src(jsDeps)
        .pipe(concat('lib.js'))
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('deps', ['deps-js', 'deps-css']);

/**
 * image minification
 */
gulp.task('imagemin', function() {
    return gulp
        .src('./src/assets/images/**')
        .pipe(
            imagemin({
                progressive: true,
                use: [pngquant()]
            })
        )
        .pipe(gulp.dest('./build/assets/images'));
});

/**
 * Build LESS
 */
gulp.task('styles', function() {
    return gulp
        .src(config.lessbase)
        .pipe(plumber())
        .pipe(less())
        .pipe(
            autoprefixer({
                browsers: ['last 2 version', '> 5%']
            })
        )
        .pipe(gulp.dest(config.css))
        .pipe(browserSync.stream({ reload: true }));
});

/**
 * Build Js
 */
gulp.task('app-js', function() {
    return (
        gulp
            .src(config.jsbase)
            .pipe(concat('app.js'))
            .pipe(
                rename({
                    suffix: '.min'
                })
            )
            //.pipe(uglify())
            .pipe(gulp.dest('./build/assets/js/'))
            .pipe(browserSync.stream({ reload: true }))
    );
});

/**
 * build HTML
 */
gulp.task('fileinclude', function() {
    gulp
        .src(['./src/*.html'])
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file'
            })
        )
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream({ reload: true }));
});

/**
 * Levantar el servidor de forma rapida.
 */
gulp.task('serveFast', ['styles', 'imagemin', 'app-js'], function() {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        injectChanges: true
    });
    gulp.watch([config.less, config.lessbase], ['styles']);
    gulp.watch([config.jsbase], ['app-js']);
    gulp.watch(['./src/*.html', './src/components/*.html'], ['fileinclude']);
    gulp.watch(['./src/*.html', './src/components/*.html']).on('change', browserSync.reload);
    gulp.watch('images/**', ['imagemin']);
});
