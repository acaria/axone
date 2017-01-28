import {bindable, autoinject} from 'aurelia-framework';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {Neuron} from '../models/neuron-item';
import * as _ from 'lodash';
import * as vis from "vis";

@autoinject()
export default class {
	private readonly containerId = "canvas";

	private apiClient: Rest;

	private nodes: vis.DataSet<vis.Node>;
	private edges: vis.DataSet<vis.Edge>;
	private network: vis.Network;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");

		this.nodes = new vis.DataSet<vis.Node>();
		this.edges = new vis.DataSet<vis.Node>();
	}

	attached() {
		$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
		window.onresize = () => {
			$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
		}
		this.loadData()
		.catch(error => {
			log.error(error);
		});
	}

	private async loadData() {
		this.nodes.clear();
		this.edges.clear();

		let items = await this.apiClient.find("neurons");

		if (items != null) {
			for (let item of items) {
				this.nodes.add({id: item._id, label: item.cell.name});

				if (item.axone) {
					this.edges.add({from: item.axone._id, to: item._id});
				}
			}
		}

		let container = document.getElementById(this.containerId);
		if (container != null) {
			$(this.containerId).height(window.innerHeight - $(".navbar").height() - 100);

			let options = {
				width: "100%"
			};

			this.network = new vis.Network(container, {nodes: this.nodes, edges: this.edges}, options);
		}
	}
}
