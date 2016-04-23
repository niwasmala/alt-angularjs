var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

// Register tasks
gulp.task('min', function() {
    return gulp.src([
            'src/**/*.js'
        ])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('concat', function() {
    return gulp.src([
            'src/**/*.js'
        ])
        .pipe(concat('alt.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('library', function() {
    return gulp.src([
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-cookies/angular-cookies.min.js',
            'bower_components/angular-jwt/dist/angular-jwt.min.js',
            'bower_components/a0-angular-storage/dist/angular-storage.min.js',
            'bower_components/cryptojslib/rollups/aes.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'bower_components/accounting/accounting.min.js'
        ])
        .pipe(concat('alt.lib.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', ['concat', 'library'], function() {
    return gulp.src([
            'dist/alt.lib.js',
            'dist/alt.min.js'
        ])
        .pipe(concat('alt.bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['min', 'concat', 'library', 'bundle']);