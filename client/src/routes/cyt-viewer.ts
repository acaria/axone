import {bindable, autoinject} from 'aurelia-framework';
import {log} from '../logger';
import * as _ from 'lodash';
import {CytSync} from '../ctrls/cyt-sync-network';

var cytoscape = require('cytoscape');
var cytoLayout = require('cytoscape-cose-bilkent');
cytoLayout(cytoscape);

@autoinject()
export default class {
	private readonly containerId = "canvas";
	private cyto:any;
	private layout:any;

	constructor(private sync: CytSync) {
	}

	attached() {
		$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 115);
		window.onresize = () => {
			$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 115);
		}

		this.cyto = cytoscape({
			container: document.getElementById(this.containerId),

			style: [
			{
				selector: 'node',
				style: {
					'background-color': '#ad1a66',
					'label': 'data(label)'
				}
			},
			{
				selector: 'edge',
				style: {
					'width': 3,
					'line-color': '#ccc',
					'target-arrow-color': '#ccc',
					'target-arrow-shape': 'triangle'
				}
			}
			],

			wheelSensitivity: 0.05
		});

		this.sync.loadNetworkData()
		.then((data) => {
			this.cyto.add(data);
			this.cyto.layout({name: "cose-bilkent"});
		})
		.catch(error => log(error));
	}
}
