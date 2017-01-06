import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
	config.globalResources([
		'./elements/tag-editor',
		'./elements/pager',
		'./elements/carousel',
		'./elements/dropdown',
		'./elements/date-picker',
		'./elements/date-range',
		'./value-converters/object-keys',
		'./value-converters/name-index'
	]);
}
