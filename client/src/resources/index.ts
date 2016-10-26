import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
	config.globalResources([
		'./elements/nav-bar',
		'./value-converters/object-keys'
	]);
}
