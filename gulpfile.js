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

gulp.task('bundle', function() {
    return gulp.src([
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-cookies/dist/angular-cookies.min.js',
            'bower_components/angular-jwt/dist/angular-jwt.min.js',
            'bower_components/a0-angular-storage/dist/angular-storage.min.js',
            'bower_components/cryptojslib/rollups/aes.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'src/**/*.js'
        ])
        .pipe(concat('alt.bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['min', 'concat', 'bundle']);