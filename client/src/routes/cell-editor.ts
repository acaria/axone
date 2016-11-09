import {bindable, autoinject} from 'aurelia-framework';
import {RouteConfig} from "aurelia-router";
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import * as _ from 'lodash';

import {fieldList} from "../views/fields/all-fields";
import {IField} from "../views/fields/base/field";

@autoinject()
export class CellEditor {
	private heading;
	private apiClient: Rest;
	private routeConfig: RouteConfig;

	private cell: any;
	private originalCell: any;
	
	private properties: Array<IField> = [];
	private newProperties: Array<IField> = [];

	private propertiesKey = "properties";

	constructor(apiConfig: ApiConfig) {
		this.heading = "Cell editor";
		this.apiClient = apiConfig.getEndpoint("api");
	}

	activate(params, routeConfig: RouteConfig){
		this.routeConfig = routeConfig;

		return this.apiClient.findOne("cells", params.id)
		.then(cell => {
			this.cell = cell;
			this.routeConfig.navModel.setTitle(cell.name);
			this.originalCell = _.clone(cell);

			this.properties = new Array<IField>();
			if (!this.cell[this.propertiesKey]) {
				this.cell[this.propertiesKey] = {};
				this.newProperties = _.clone(fieldList);
			} else {
				for(let field of fieldList) {
					if (this.cell[this.propertiesKey][field.name]) {
						this.properties.push(_.clone(field));
					} else {
						this.newProperties.push(_.clone(field));
					}
				}	
			}
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
		let el = _.find(this.newProperties, {name: name});
		if (el != null) {
			this.properties.push(el);
			this.newProperties.splice(_.indexOf(this.newProperties, el), 1);
		}
	}

	removeProperty(event, name:string) {
		event.cancelBubble = true;
		let el = _.find(this.properties, {name: name});
		if (el != null) {
			delete this.cell[this.propertiesKey][el.name];
			this.newProperties.push(el);
			this.properties.splice(_.indexOf(this.properties, el), 1);
		}
	}

	save() {
		this.apiClient.update("cells", this.cell._id, this.cell).then(cell => {
			this.cell = cell
			this.routeConfig.navModel.setTitle(cell.name);
			this.originalCell = _.clone(cell);
			history.back();
		});
	}

	cancel() {
		this.cell = _.clone(this.originalCell);
		history.back();
	}

	canDeactivate() {
		if (!_.isEqual(this.originalCell, this.cell)){
			return confirm('You have unsaved changes. Are you sure you wish to leave?');
		}

		return true;
	}
}