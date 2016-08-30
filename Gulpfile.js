const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');
 
gulp.task('default', () => {
    return gulp.src('src/vue-resource-progressbar-interceptor.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('vue-resource-progressbar-interceptor.es5.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('vue-resource-progressbar-interceptor.min.js'))
        .pipe(gulp.dest('dist'));
});
