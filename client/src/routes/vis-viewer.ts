import {bindable, autoinject} from 'aurelia-framework';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import * as _ from 'lodash';
import * as vis from "vis";
import SyncNetwork from '../ctrls/vis-sync-network';

@autoinject()
export default class {
	private readonly containerId = "canvas";

	private nodes: vis.DataSet<vis.Node>;
	private edges: vis.DataSet<vis.Edge>;
	private network: vis.Network;

	private cmdInfo:string = "";
	private addingMode:boolean = false;
	private linkingMode:boolean = false;
	private deleteCmdEnabled:boolean = false;

	constructor(private sync: SyncNetwork) {
	}

	attached() {
		$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 115);
		window.onresize = () => {
			$("#" + this.containerId).height(window.innerHeight - $(".navbar").height() - 115);
		}

		this.initNetwork();

		this.sync.loadNetworkData()
		.then((data) => {
			this.nodes = data.nodes as vis.DataSet<vis.Node>;
			this.edges = data.edges as vis.DataSet<vis.Edge>;
			this.bindDataEvents();
			this.network.setData({nodes: data.nodes, edges: data.edges});
		})
		.catch(error => {
			log.error(error);
		});
	}

	toggleAddingMode() {
		if (!this.addingMode) {
			let selection = this.network.getSelection();
			if (selection.nodes.length == 1) {
				let tmpId = this.sync.genTmpID();
				this.nodes.add({id: tmpId, label: "new"});
				this.edges.add({from: tmpId, to: selection.nodes[0].toString()});
			} else {
				this.linkingMode = false;
				this.network.addNodeMode();
				this.addingMode = true;
				this.cmdInfo = "Click to place a new node";
			}
		} else {
			this.network.disableEditMode();
			this.addingMode = false;
			this.cmdInfo = "";
		}
	}

	toggleLinkingMode() {
		if (!this.linkingMode) {
			this.addingMode = false;
			this.network.addEdgeMode();
			this.linkingMode = true;
			this.cmdInfo = "Drag the edge between two nodes to connect them"
		} else {
			this.network.disableEditMode();
			this.linkingMode = false;
			this.cmdInfo = "";
		}
	}

	deleteSelection() {
		this.network.deleteSelected();
		this.deleteCmdEnabled = false;
	}

	private bindDataEvents() {
		this.nodes.on("add", (event, properties, senderId) => {
			this.addingMode = false;
			this.linkingMode = false;
			this.cmdInfo = "";

			if (properties.items && properties.items.length > 0) {
				for(let itemId of properties.items) {
					if (!_.startsWith(itemId, this.sync.uidTmpTag)) {
						let node:vis.Node = this.nodes.get(itemId);
						node.id = this.sync.genTmpID();
						node.label = "new";
					}
				}
			}
		});

		this.edges.on("add", (event, properties, senderId) => {
			this.addingMode = false;
			this.linkingMode = false;
			this.cmdInfo = "";
		});
	}

	private initNetwork() {
		let options = {
			width: "100%"
		};

		let container = document.getElementById(this.containerId);
		this.network = new vis.Network(container!, {}, options);

		this.network.on("select", (params) => {
			let selection = this.network.getSelection();
			this.deleteCmdEnabled = (selection.edges.length != 0 || selection.nodes.length != 0);
		});

/*		this.network.on("selectNode", (params) => {
			log.info("selectNode" + params);
		});

		this.network.on("selectEdge", (params) => {
			log.info("selectEdge" + params);
		});

		this.network.on("deselectNode", (params) => {
			log.info("deselectNode" + params);
		});

		this.network.on("deselectEdge", (params) => {
			log.info("deselectEdge" + params);
		});

		this.network.on("hoverNode", (params) => {
			log.info("hoverNode" + params);
		});

		this.network.on("hoverEdge", (params) => {
			log.info("hoverEdge" + params);
		});

		this.network.on("hoverNode", (params) => {
			log.info("hoverNode" + params);
		});

		this.network.on("blurNode", (params) => {
			log.info("blurNode" + params);
		});

		this.network.on("blurEdge", (params) => {
			log.info("blurEdge" + params);
		});

		this.network.on("click", (params) => {
			log.info("click" + params);
		});

		this.network.on("doubleClick", (params) => {
			log.info("doubleClick" + params);
		});

		this.network.on("oncontext", (params) => {
			log.info("oncontext" + params);
		});

		this.network.on("dragStart", (params) => {
			log.info("dragStart" + params);
		});

		this.network.on("dragging", (params) => {
			log.info("dragging" + params);
		});

		this.network.on("dragEnd", (params) => {
			log.info("dragEnd" + params);
		});

		this.network.on("dragEnd", (params) => {
			log.info("dragEnd" + params);
		});

		this.network.on("zoom", (params) => {
			log.info("zoom" + params);
		});

		this.network.on("showPopup", (params) => {
			log.info("showPopup" + params);
		});

		this.network.on("hidePopup", (params) => {
			log.info("hidePopup" + params);
		});*/
	}
}
