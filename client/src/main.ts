import {Aurelia} from 'aurelia-framework';
import {LogManager} from "aurelia-framework";
import {ConsoleAppender} from "aurelia-logging-console";
import environment from './environment';

(<any>Promise).config({
	warnings: {
		wForgottenReturn: false
	}
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
	});

	if (environment.debug) {
		LogManager.addAppender(new ConsoleAppender());
		LogManager.setLevel(LogManager.logLevel.debug);
	}

	if (environment.testing) {
		aurelia.use.plugin('aurelia-testing');
	}

	aurelia.start().then(() => aurelia.setRoot(''));
}