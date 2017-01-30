import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {IEvent, EventDispatcher} from '../models/event-dispatcher';
import {Neuron} from '../models/neuron-item';
import * as _ from 'lodash';
import * as vis from "vis";

@autoinject()
export default class {
	private readonly uidTmpTag = "_TMP_";

	private tmpUID:number = 1; 
	private apiClient: Rest;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	private genTmpID() {
		return this.uidTmpTag + this.tmpUID++;
	}

	async loadNetworkData():Promise<vis.Data> {
		let nodes = new vis.DataSet<vis.Node>();
		let edges = new vis.DataSet<vis.Edge>();

		let items = await this.apiClient.find("neurons");

		if (items != null) {
			for (let item of items) {
				nodes.add({id: item._id, label: item.cell.name});

				if (item.axone) {
					edges.add({from: item.axone._id, to: item._id});
				}
			}
		}
		return {nodes: nodes, edges: edges};
	}
}
