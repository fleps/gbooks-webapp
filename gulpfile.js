// dependecies
var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require("browser-sync").create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence'); //remember to remove run-sequence alltogether when Gulp 4 launch

//task to run browser-sync server on your SRC dir
gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: 'src'
    },
  })
})

//task to run browser-sync server on your DIST dir on 8080 port so doesn't conflct with STC server
gulp.task('bs-build', function() {
  bs.init({
    port: 8080,
    ui:{
      port: 8081
    },
    server: {
      baseDir: 'dist'
    },
  })
})

//Compile SASS into CSS file then reload the application. This will run from the watcher task
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(bs.reload({
            stream: true
        }))
});

// Create minified CSS/JS in DIST directory with HTML files pointing to minified versions
gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'))
});

// Task to compress images and save them on DIST directory (also create a chached version)
gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
});

// Clean the DIST folder when building it, to make sure we don't have old / unused files.
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// Task to clean your system cache. Only use if needed
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

/*BUILD task to create your DIST version. It will:
-- run the CLEAN:DIST task and wait untill is completed, then
-- run the SASS task to make sure your CSS is updated
-- run the USEREF task to minifiy CSS/JS and then copy them to DIST folder + HTML's pointing to MIN versions
-- run the IMAGES task to optimize images (considering the cache / new images)
-- And finally run the DIST server opening your final build so you can see if everything is working
*/
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images'],'bs-build',
    callback
  )
})

// Gulp watcher task to CSS, HTML and JS file modification
gulp.task('watcher', ['bs', 'sass'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*html', bs.reload);
    gulp.watch('src/js/**/*js', bs.reload);
});