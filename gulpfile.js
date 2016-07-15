(() => {
    'use strict';

    const gulp = require('gulp');
    const browserSync = require('browser-sync');
    const babelify = require('babelify');
    const browserify = require('browserify');
    const source = require('vinyl-source-stream');
    const del = require('del');
    const loadPlugins = require('gulp-load-plugins');
    const wiredep = require('wiredep').stream;

    const $ = loadPlugins();
    const reload = browserSync.reload;

    const path = {
        src: './src',
        dist: './dist',
        docs: './docs'
    };

    // ES6 to ES5 with Babel
    gulp.task('scripts', () => {
        browserify({
            entries: path.src + '/app.js',
            debug: true
        })
            .transform(babelify, {
                presets: ['es2015']
            })
            .bundle()
            .pipe(source('app.bundle.js'))
            .pipe(gulp.dest(path.dist))
            .pipe(reload({
                stream: true
            }));
    });

    // jsDoc
    gulp.task('js-doc', ['clean-docs'], (cb) => {
        gulp.src([
            'README.md',
            path.src + '/**/*.js'
        ], {
            read: false
        })
            .pipe($.jsdoc3(cb));
    });

    gulp.task('clean-docs', del.bind(null, path.docs));

    // Jade to HTML
    gulp.task('views', () => {
        return gulp.src(path.src + '/*.jade')
            .pipe($.plumber())
            .pipe($.jade({
                pretty: true
            }))
            .pipe(gulp.dest(path.dist))
            .pipe(reload({
                stream: true
            }));
    });

    // Sass to css
    gulp.task('styles', () => {
        return gulp.src(path.src + '/main.{sass, scss}')
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.sass.sync({
                outputStyle: 'expanded',
                precision: 10,
                includePaths: ['.']
            }).on('error', $.sass.logError))
            .pipe($.autoprefixer({
                browsers: ['> 1%', 'last 2 versions']
            }))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(path.dist))
            .pipe(reload({
                stream: true
            }));
    });

    gulp.task('json', () => {
        return gulp.src(path.src + '/*.json')
            .pipe(gulp.dest(path.dist))
            .pipe(reload({
                stream: true
            }));
    });
    // Build
    gulp.task('serve', ['scripts', 'views', 'styles', 'json', 'js-doc'], () => {
        browserSync({
            notify: false,
            port: 9000,
            server: {
                baseDir: [
                    path.dist,
                    path.src
                ],
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            'src/*.*'
        ]).on('change', reload);

        gulp.watch(path.src + '/**/*.{sass, scss}', ['styles']);
        gulp.watch(path.src + '/**/*.js', ['scripts']);
        gulp.watch(path.src + '/**/*.jade', ['views']);
        gulp.watch(path.src + '/*.json', ['json']);
        gulp.watch('bower.json', ['wiredep']);
    });

    gulp.task('wiredep', () => {
        gulp.src(path.src + '/main.sass')
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)+/
            }))
            .pipe(gulp.dest(path.src));
    });

    gulp.task('clean', del.bind(null, [
        path.dist
    ]));

    gulp.task('default', ['clean'], () => {
        gulp.start('serve');
    });

})();