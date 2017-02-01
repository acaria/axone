import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {IEvent, EventDispatcher} from '../models/event-dispatcher';
import {Neuron} from '../models/neuron-item';
import * as _ from 'lodash';
import * as cy from "cytoscape";

export interface Element {
	data: { id: string, label: string } |
			{ id: string, source: string, target:string },
	group: "nodes" | "edges"
}

@autoinject()
export class CytSync {
	private apiClient: Rest;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	async loadNetworkData(): Promise<Array<any>> {
		let result = new Array<Element>();

		let items = await this.apiClient.find("neurons");

		if (items != null) {
			for (let item of items) {
				result.push({
					data: {
						id: item._id, 
						label: item.cell.name
					},
					group: "nodes"
				});

				if (item.axone) {
					result.push({
						data: {
							id: item._id + item.axone._id,
							source: item._id,
							target: item.axone._id
						},
						group: "edges"
					});
				}
			}
		}
		return result;
	}
}
