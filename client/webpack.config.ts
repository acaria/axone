/// <reference path="./node_modules/@types/node/index.d.ts" />
import { generateConfig, get, stripMetadata, EasyWebpackConfig } from '@easy-webpack/core';
import * as path from 'path';

import * as envProd from '@easy-webpack/config-env-production';
import * as envDev from '@easy-webpack/config-env-development';
import * as aurelia from '@easy-webpack/config-aurelia';
import * as typescript from '@easy-webpack/config-typescript';
import * as html from '@easy-webpack/config-html';
import * as css from '@easy-webpack/config-css';
import * as fontAndImages from '@easy-webpack/config-fonts-and-images';
import * as globalBluebird from '@easy-webpack/config-global-bluebird';
import * as globalJquery from '@easy-webpack/config-global-jquery';
import * as generateIndexHtml from '@easy-webpack/config-generate-index-html';
import * as commonChunksOptimize from '@easy-webpack/config-common-chunks-simple';
import * as copyFiles from '@easy-webpack/config-copy-files';
import * as uglify from '@easy-webpack/config-uglify';
import * as generateCoverage from '@easy-webpack/config-test-coverage-istanbul';

const ENV: 'development' | 'production' | 'test' = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = 'development');

// basic configuration:
const title = 'Axone';
const debugPort = 7249;
const baseUrl = '/';
const rootDir = path.resolve();
const srcDir = path.resolve('src');
const outDir = path.resolve('dist');

const coreBundles = {
	bootstrap: [
		'aurelia-bootstrapper-webpack',
		'aurelia-polyfills',
		'aurelia-pal',
		'aurelia-pal-browser',
		'bluebird'
	],
	aurelia: [
		'aurelia-api',
		'aurelia-authentication',
		'aurelia-bootstrapper-webpack',
		'aurelia-binding',
		'aurelia-dependency-injection',
		'aurelia-event-aggregator',
		'aurelia-fetch-client',
		'aurelia-framework',
		'aurelia-history',
		'aurelia-history-browser',
		'aurelia-loader',
		'aurelia-loader-webpack',
		'aurelia-logging',
		'aurelia-logging-console',
		'aurelia-metadata',
		'aurelia-pal',
		'aurelia-pal-browser',
		'aurelia-path',
		'aurelia-polyfills',
		'aurelia-route-recognizer',
		'aurelia-router',
		'aurelia-task-queue',
		'aurelia-templating',
		'aurelia-templating-binding',
		'aurelia-templating-router',
		'aurelia-templating-resources'
	]
}

let config = generateConfig(
	{
		entry: {
			'app': ['./src/main' ],
			'aurelia-bootstrap': coreBundles.bootstrap,
			'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
		},
		output: {
			path: outDir,
		}
	},

	ENV === 'test' || ENV === 'development' ?
	envDev({devtool: 'inline-source-map'}) :
	envProd({ /* devtool: '...' */ }),

	aurelia({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),
	typescript(ENV !== 'test' ? {} : { options: { doTypeCheck: false, sourceMap: false, inlineSourceMap: true, inlineSources: true } }),
	html(),
	css({ filename: 'styles.css', allChunks: true, sourceMap: false }),
	fontAndImages(),
	globalBluebird(),
	globalJquery(),
	generateIndexHtml({minify: ENV === 'production'}),

	...(ENV === 'production' || ENV === 'development' ? [
		commonChunksOptimize({appChunkName: 'app', firstChunk: 'aurelia-bootstrap'}),
		copyFiles({patterns: [{ from: 'static', to: ''}]})
	] : [ /* ENV === 'test' */
		generateCoverage({ options: { esModules: true } })
	]),

	ENV === 'production' ? 
	uglify({debug: false, mangle: { except: ['cb', '__webpack_require__'] }}) : 
	{ devServer: { port: debugPort } }
);

module.exports = stripMetadata(config);
