import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {Neuron} from '../models/neuron-item';
import {RadialTreeview, Node} from '../views/radial-treeview';
import * as _ from 'lodash';
import * as vis from "vis";

@autoinject()
export default class {
	private apiClient: Rest;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	async loadNetworkData(): Promise<Array<Node>> {
		let result = new Array<Node>({
			name: "Root",
			id: "_root",
			parent: null
		});

		let items = await this.apiClient.find("neurons");

		if (items != null) {
			for (let item of items) {
				result.push({
					name: item.cell.name,
					id: item._id,
					parent: (item.axone ? item.axone._id : "_root")
				});
			}
		}
		return result;
	}
}
