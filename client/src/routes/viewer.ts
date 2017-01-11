import {bindable, autoinject} from 'aurelia-framework';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {Neuron} from '../models/neuron-item';
import {RadialTreeview, Node} from '../views/radial-treeview';
import * as _ from 'lodash';

@autoinject()
export default class {
	private apiClient: Rest;
	private treeView: RadialTreeview;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
		this.treeView = new RadialTreeview("#canvas");
	}

	attached() {
		this.treeView.init();

		this.loadData();

		// this.treeView.setData([
		// 	{"name": "Top Level", "parent": null}, 
		// 	{"name": "Level 2: A", "parent": "Top Level" },
		// 	{"name": "Level 2: B", "parent": "Top Level" },
		// 	{"name": "Level 3: A", "parent": "Level 2: A" },
		// 	{"name": "Level 3: B", "parent": "Level 2: A" },
		// 	{"name": "Level 3: C", "parent": "Level 2: A" },
		// 	{"name": "Level 4: A", "parent": "Level 3: A" },
		// 	{"name": "Level 4: B", "parent": "Level 3: A" },
		// 	{"name": "Level 5: A", "parent": "Level 4: A" },
		// 	{"name": "Level 6: A", "parent": "Level 5: A" },
		// 	{"name": "Daughter of A", "parent": "Level 2: A"}
		// 	]);
	}

	private Neurons2NodeConverter(items:Array<Neuron>):Array<Node> | null
	{
		if (items == null) {
			return null;
		}
		let result = new Array<Node>();
		for (let item of items) {
			result.push({
				name: item.cell.name,
				id: item.id,
				parent: (item.axone ? item.axone.id : null)
			});
		}
		return result;
	}

	private async loadData() {
		let items = await this.apiClient.find("neurons");
		let elements = this.Neurons2NodeConverter(items);
		this.treeView.setData(elements || []);
	}
}
