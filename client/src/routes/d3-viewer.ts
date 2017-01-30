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

		this.loadData()
		.catch(error => {
			log.error(error);
		});
	}

	private Neurons2NodeConverter(items:Array<Neuron>):Array<Node>
	{
		let result = new Array<Node>({
			name: "Root",
			id: "_root",
			parent: null
		});
		
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

	private async loadData() {
		let items = await this.apiClient.find("neurons");
		let elements = this.Neurons2NodeConverter(items);
		this.treeView.setData(elements);
	}
}
