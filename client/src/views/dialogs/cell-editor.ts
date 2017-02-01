import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {AuthService, FetchConfig} from 'aurelia-authentication';
import {HttpClient} from 'aurelia-fetch-client';
import {Config as ApiConfig, Rest} from "aurelia-api";
import * as _ from 'lodash';

import {log} from '../../logger';
import appCfg from '../../app-config';

import {fieldList} from "../../views/fields/all-fields";
import {IField} from "../../views/fields/base/field";

@autoinject()
export class CellEditor {

	private apiClient: Rest;
	private client: HttpClient;

	private cell: any;
	private originalCell: any;

	private properties: Array<IField> = [];
	private newProperties: Array<IField> = [];

	private propertiesKey = "properties";

	constructor(private ctrl:DialogController, apiConfig: ApiConfig, private auth:AuthService, private fetch:FetchConfig ) {
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

	activate(cellId: string) {
		this.fetch.configure(this.client);

		return this.apiClient.findOne("cells", cellId)
		.then(cell => {
			this.cell = cell;
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


}
