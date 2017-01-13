import {Aurelia} from 'aurelia-framework';
import {log, ConsoleAppender} from './logger';
import authConfig from './auth-config';
import appConfig from './app-config';
// we want font-awesome to load as soon as possible to show the fa-spinner
import '../styles/app.css';
import '../styles/dialog.css';
import '../styles/navbar.css';
import '../styles/home.css';
import '../styles/profile.css';
import '../styles/viewer.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// comment out if you don't want a Promise polyfill (remove also from webpack.config.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
	aurelia.use
	.standardConfiguration()
	.feature('resources')

	.plugin('aurelia-dialog', config => {
		config.useDefaults();
		config.settings.lock = true;
		config.settings.centerHorizontalOnly = false;
		config.settings.startingZIndex = 1111115;
	})

	.plugin('aurelia-api', config => {
		config
		.registerEndpoint('auth', configure => {
			configure.withBaseUrl(appConfig.endPoint.baseUrl + appConfig.endPoint.auth);
		})
		.registerEndpoint('api', configure => {
			configure.withBaseUrl(appConfig.endPoint.baseUrl + appConfig.endPoint.api);
		});
	})

	.plugin('aurelia-authentication', baseConfig => {
		baseConfig.configure(authConfig)
	});

	let env = process.env.NODE_ENV;

	if (env == 'development') {
		aurelia.use.developmentLogging();
	}

	// Uncomment the line below to enable animation.
	//aurelia.use.plugin('aurelia-animator-css');
	// if the css animator is enabled, add swap-order="after" to all router-view elements

	// Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
	// aurelia.use.plugin('aurelia-html-import-template-loader')

	await aurelia.start();
	aurelia.setRoot('app');

	// if you would like your website to work offline (Service Worker), 
	// install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
