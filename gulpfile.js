var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var files = [
    'src/**/*.js'
];

// Register tasks
gulp.task('min', function() {
    return gulp.src(files)
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', function() {
    return gulp.src(files)
        .pipe(concat('alt.bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['min', 'bundle']);