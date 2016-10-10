var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    gulpif = require('gulp-if'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    exec = require('child_process').exec,
    mkdirs = require('mkdirs');
    argv = require('yargs').argv;

if (argv.production) {
    process.env.NODE_ENV = 'production';
}

if (argv.port && parseInt(argv.port)) {
    process.env.PORT = parseInt(argv.port);
}

var paths = {
    jsFiles: ['src/**/*.js'],
    tsFiles: ['src/**/*.ts'],
    dbDir: './data/',
};

var cfg = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 8080
}

function runCommand(command) {    
    exec(command, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
    });
}

gulp.task('clean', function clean(done) {
    return del(['build'], done);
});

gulp.task('build-ts', function() {
    return gulp.src(paths.tsFiles, { since: gulp.lastRun('build-ts')})
        .pipe(tslint({
            configuration: "tslint.json",
            formatter: "verbose"
        }))
        .pipe(tslint.report({
            emitError: false
        }))
        .pipe(ts({
            module: "commonjs",
            target: "es6",
            sourceMap: false,
            declaration: false,
            removeComments: true
        }))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('build-js', function() {
    return gulp.src(paths.jsFiles, { since: gulp.lastRun('build-js')})
        .pipe(jshint('jshint.json'))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.tsFiles, gulp.series('build-ts'));
    gulp.watch(paths.jsFiles, gulp.series('build-js'));
});

gulp.task('mongo-start', function(done) {
    mkdirs('./data');
    runCommand('mongod --dbpath "' + paths.dbDir + '"');
    done();
});

gulp.task('mongo-stop', function(done) {
    runCommand('mongo admin --eval "db.shutdownServer();"');
    done();
});

gulp.task('nodemon', function() {
    var stream = nodemon({
        script: './build/index.js',
        ext: 'html js',
        ignore: ['node_modules/**', 'public/**'],
        env: { 
            PORT: cfg.port 
        },
        tasks: function(changedFiles) {
            var tasks = [];
            return tasks;
        }
    });

    stream
        .on('restart', function() {
            console.log('restarted!');
        })
        .on('crash', function() {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10);
        })
});

gulp.task('open-dev', function(){
  setTimeout(function() {
    gulp.src(__filename)
        .pipe(open({uri: 'http://localhost:8080/'}));
  }, 1500);
});

gulp.task(
    'build', 
        gulp.series(
            'clean', 
            gulp.parallel('build-ts', 'build-js'
        )
    )
);

gulp.task(
    'run',
    gulp.series(
        gulp.parallel('mongo-start', 'build'),
        gulp.parallel('nodemon', 'watch', 'open-dev')
    )
);

gulp.task('default', gulp.series('run'));
gulp.task('default').description = "build and run devenv";