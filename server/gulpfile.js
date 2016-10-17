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
browserSync = require('browser-sync'),
del = require('del'),
exec = require('child_process').exec,
mkdirs = require('mkdirs');
argv = require('yargs').argv;
shell = require('gulp-shell');

if (argv.production) {
	process.env.NODE_ENV = 'production';
}

if (argv.port && parseInt(argv.port)) {
	process.env.PORT = parseInt(argv.port);
}

var cfg = {
	path: {
		files: {
			js: ['./src/**/*.js'],
			ts: ['./src/**/*.ts'],
			ejs: ['./view/**/*.ejs']
		},
		dir: {
			db: './data',
			src: './src',
			dest: './build',
			view: './view'
		}
	},
	env: process.env.NODE_ENV || 'development',
	port: parseInt(process.env.PORT) || 8080
};

function runCommand(command) {    
	exec(command, function(err, stdout, stderr) {
        //console.log(stdout);
        console.log(stderr);
        if (err !== null) {
        	console.log('exec error: ' + err);
        }
     });
}

gulp.task('clean', function clean(done) {
	return del([cfg.path.dir.dest], done);
});

gulp.task('browser-sync', function() {
	browserSync.init({
		browser: 'chrome',
		notify: false,
		files: [
		cfg.path.files.js,
		cfg.path.files.ejs
		],
		proxy: 'localhost:8080'
	});
});

gulp.task('build-ts', function() {
	return gulp.src(cfg.path.files.ts, { since: gulp.lastRun('build-ts')})
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
	.pipe(gulp.dest('build'));
});

gulp.task('build-js', function() {
	return gulp.src(cfg.path.files.js, { since: gulp.lastRun('build-js')})
	.pipe(jshint('jshint.json'))
	.pipe(jshint.reporter('default'))
	.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch(cfg.path.files.ts, gulp.series('build-ts'));
	gulp.watch(cfg.path.files.js, gulp.series('build-js'));
});

gulp.task('mongo-start', function(done) {
	mkdirs(cfg.path.dir.db);
	runCommand('mongod --dbpath "' + cfg.path.dir.db + '"');
	done();
});

gulp.task('mongo-stop', function(done) {
	runCommand('mongo admin --eval "db.shutdownServer();"');
	done();
});

gulp.task('build-client', shell.task('au build', {cwd: '../client'}));

gulp.task('nodemon', function() {
	var stream = nodemon({
		script: './build/index.js',
		ext: 'html js',
		ignore: ['node_modules/**', 'public/**'],
		watch: cfg.path.dir.dest,
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
		setTimeout(function() {
			browserSync.reload();
		}, 1000);

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

gulp.task('build', 
	gulp.series(
		'clean',
		gulp.parallel('build-ts', 'build-js', 'build-client')
		)
	);

gulp.task('run',
	gulp.series(
		gulp.parallel('mongo-start', 'build'),
		gulp.parallel('nodemon', 'watch', 'browser-sync')
		)
	);

gulp.task('default', gulp.series('run'));
gulp.task('default').description = "build and run devenv";