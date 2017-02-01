import {bindable, autoinject} from 'aurelia-framework';
import {RouteConfig} from "aurelia-router";
import * as _ from 'lodash';

import PropertiesCtrl from '../ctrls/cell-field-properties';
import {log} from '../logger';
import appCfg from '../app-config';

import {IField} from "../views/fields/base/field";

@autoinject()
export class CellEditor {
	private heading;
	private routeConfig: RouteConfig;

	private properties: Array<IField> = [];
	private newProperties: Array<IField> = [];
	private cell:Object = {};

	constructor(private propertiesCtrl: PropertiesCtrl) {
		this.heading = "Cell editor";
	}

	activate(params, routeConfig: RouteConfig){
		this.routeConfig = routeConfig;

		this.propertiesCtrl.load(params.id)
		.then((cell) => {
			this.cell = cell;
			if (this.routeConfig.navModel != null) {
				this.routeConfig.navModel.setTitle(cell.name);
			}
			this.properties = this.propertiesCtrl.currentProperties;
			this.newProperties = this.propertiesCtrl.availableProperties;
		})
		.catch(error => log.error(error));		
	}

	get canSave() {
		return true;
	}

	get withNewProperties() {
		return this.newProperties.length > 0;
	}

	addProperty(name:string) {
		this.propertiesCtrl.add(name);
	}

	removeProperty(event, name:string) {
		event.cancelBubble = true;
		this.propertiesCtrl.remove(name);
	}

	save() {
		this.propertiesCtrl.save()
		.then(() => {
			history.back();
		})
		.catch(error => {
			log.error(error);
		});
	}

	cancel() {
		this.propertiesCtrl.roolback();
		history.back();
	}

	canDeactivate() {
		if (!this.propertiesCtrl.isUnchanged()){
			return confirm('You have unsaved changes. Are you sure you wish to leave?');
		}

		return true;
	}
}
