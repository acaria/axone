import {bindable, autoinject} from 'aurelia-framework';
import {AuthService, FetchConfig} from 'aurelia-authentication';
import {HttpClient} from 'aurelia-fetch-client';
import {Config as ApiConfig, Rest} from "aurelia-api";
import * as _ from 'lodash';

import {log} from '../logger';
import appCfg from '../app-config';

import {fieldList} from "../views/fields/all-fields";
import {IField} from "../views/fields/base/field";

@autoinject()
export default class {
	private readonly propertiesKey = "properties";

	private properties: Array<IField> = [];
	private newProperties: Array<IField> = [];

	private cell: any;
	private originalCell: any;

	private apiClient: Rest;
	private client: HttpClient;

	constructor(apiConfig: ApiConfig, private auth:AuthService, private fetch:FetchConfig) {
		this.apiClient = apiConfig.getEndpoint("api");

		this.client = new HttpClient();
		this.client.configure(config => { config
			.withBaseUrl(appCfg.endPoint.baseUrl + appCfg.endPoint.api + "cells/")
			.withDefaults({
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'X-Requested-With': 'Fetch'
				}
			});
		});
	}

	async load(cellId:string) {
		this.newProperties = [];

		this.fetch.configure(this.client);

		this.cell = await this.apiClient.findOne("cells", cellId);
		this.originalCell = _.clone(this.cell);

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
		return this.cell;
	}

	async save() {
		await this.asyncPreSave();
		this.cell = await this.apiClient.update("cells", this.cell._id, this.cell);
		this.originalCell = _.clone(this.cell);
	}

	get currentProperties():Array<IField> {
		return this.properties;
	}

	get availableProperties():Array<IField> {
		return this.newProperties;
	}

	add(name:string) {
		let el = _.find(this.newProperties, {name: name});
		if (el != null) {
			this.properties.push(el);
			this.newProperties.splice(_.indexOf(this.newProperties, el), 1);
		}
	}

	remove(name:string) {
		let el = _.find(this.properties, {name: name});
		if (el != null) {
			delete this.cell[this.propertiesKey][el.name];
			this.newProperties.push(el);
			this.properties.splice(_.indexOf(this.properties, el), 1);
		}
	}

	asyncPreSave() {
		let model = this.cell[this.propertiesKey];
		return new Promise((resolve, reject) => {
			try {
				let list = new Array<Promise<any>>();
				for(let property of this.properties) {
					if (property.preSave) {
						property.preSave(model, this.client, list);
					}
				}
				if (list.length > 0) {
					Promise.all(list)
					.then(() => resolve())
					.catch((error) => {
						reject(error);
					});
				} else {
					resolve();
				}
			} catch(error) {
				reject(error);
			}
		});
	}

	roolback() {
		this.cell = _.clone(this.originalCell);
	}

	isUnchanged():boolean {
		return _.isEqual(this.originalCell, this.cell);
	}
} 
