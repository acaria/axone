import {Aurelia, LogManager} from "aurelia-framework";
import {log, ConsoleAppender} from './logger';
import environment from './environment';
import authConfig from './auth-config';

(<any>Promise).config({
	warnings: false
});

export function configure(aurelia: Aurelia) {
	aurelia.use
	.standardConfiguration()
	.feature('resources')
	
	.plugin('aurelia-dialog', config => {
		config.useDefaults();
		config.settings.lock = true;
		config.settings.centerHorizontalOnly = false;
		config.settings.startingZIndex = 1111115;
	})

	.plugin('aurelia-api', config => { config
		.registerEndpoint('auth', '/auth/')
		.registerEndpoint('api', '/api/');
	})

	.plugin('aurelia-authentication', baseConfig => {
		baseConfig.configure(authConfig)
	});

	if (environment.debug) {
		LogManager.addAppender(new ConsoleAppender());
		LogManager.setLevel(LogManager.logLevel.debug);
	}

	if (environment.testing) {
		aurelia.use.plugin('aurelia-testing');
	}

	aurelia.start().then(a => a.setRoot());
}
