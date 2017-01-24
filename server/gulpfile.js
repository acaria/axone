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
cp = require('child_process'),
mkdirs = require('mkdirs'),
argv = require('yargs').argv,
shell = require('gulp-shell');

var tsProject = ts.createProject('tsconfig.json');
var cfg = require('./config.js');

// if (argv.production) {
// 	process.env.NODE_ENV = 'production';
// }

// if (argv.port && parseInt(argv.port)) {
// 	process.env.PORT = parseInt(argv.port);
// }

function runCommand(command) {    
	cp.exec(command, function(err, stdout, stderr) {
		//console.log(stdout);
		console.log(stderr);
		if (err !== null) {
			console.log('exec error: ' + err);
		}
	});
}

gulp.task('clean', function clean(done) {
	return del([cfg.path.dir.dest,
		cfg.path.dir.client
		], {force: true}, done);
});

gulp.task('set-prod-node-env', function(done) {
    process.env.NODE_ENV = 'production';
    done();
});

gulp.task('browser-sync', function() {
	browserSync.init({
		browser: 'chrome',
		port: cfg.port.bs,
		ui: {
			port: cfg.port.bsUi
		},
		notify: false,
		files: [ cfg.path.files.js, cfg.path.files.ejs ],
		proxy: cfg.uri + ':' + cfg.port.node
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
	.pipe(tsProject())
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
	runCommand('mongod --dbpath "' + cfg.path.dir.db + '" --port ' + cfg.port.mongo);
	done();
});

gulp.task('mongo-stop', function(done) {
	runCommand('mongo admin --eval "db.shutdownServer();"');
	done();
});

gulp.task('build-client', shell.task('npm run build:prod', {cwd: '../client'}));

gulp.task('nodemon', function() {
	var stream = nodemon({
		script: './build/index.js',
		ext: 'html js',
		ignore: ['node_modules/**', 'public/**'],
		watch: [cfg.path.dir.dest, cfg.path.dir.client],
		env: { 
			PORT: cfg.port.node
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
		}, 2000);

	})
	.on('crash', function() {
		console.error('Application has crashed!\n')
		stream.emit('restart', 10);
	})
});

gulp.task('config', function(done) {
	console.log(JSON.stringify(cfg, null, 2));
	done();
});

gulp.task('transfert', function() {
	return cp.exec('scp -P 7222 -r build ../client/dist ../client/images package.json setenv.prod.sh tsconfig.json tslint.json public acaria@acasrv:~/project/axone');
});

gulp.task('open-dev', function(){
	setTimeout(function() {
		gulp.src(__filename)
		.pipe(open({uri: cfg.uri + ':' + cfg.port.node + '/'}));
	}, 1500);
});

gulp.task('build',
	gulp.series(
		'clean',
		gulp.parallel('build-ts', 'build-js')));

gulp.task('run',
	gulp.series(
		gulp.parallel('mongo-start', 'build'),
		gulp.parallel('nodemon', 'watch', 'browser-sync')));

gulp.task('deploy',
	gulp.series(
		'set-prod-node-env',
		'clean',
		'build-client',
		'build-ts',
		'build-js',
		'transfert'));

gulp.task('default', gulp.series('run'));
gulp.task('default').description = "build and run devenv";