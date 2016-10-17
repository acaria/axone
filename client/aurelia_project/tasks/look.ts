import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import build from './build';
import {CLIOptions} from 'aurelia-cli';

function onChange(path) {
  console.log(`File Changed: ${path}`);
}

let look = function() {
  gulp.watch(project.transpiler.source, build).on('change', onChange);
  gulp.watch(project.markupProcessor.source, build).on('change', onChange);
  gulp.watch(project.cssProcessor.source, build).on('change', onChange);
}

export default look;
