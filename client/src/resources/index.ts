import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
	config.globalResources([
		'./elements/nav-bar',
		'./elements/tag-editor',
		'./elements/pager',
		'./value-converters/object-keys',
		'./value-converters/name-index'
	]);
}
