var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('assets/skin/default_skin/less/*.less')
      .pipe(less())
      .pipe(gulp.dest('/assets/skin/default_skin/css'));
});

gulp.task('watch', function () {
  gulp.watch(['assets/skin/default_skin/less/*.less'], ['less']);
});

gulp.task('default', ['watch']);