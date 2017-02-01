import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
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

	constructor(private sync: SyncNetwork, private dlg: DialogService) {
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
				this.addNodeNextSelection();
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

	addNodeNextSelection() {
		let selection = this.network.getSelection();
		let positions = this.network.getPositions(selection.nodes);
		let sPos = positions[selection.nodes[0]];
		let tmpId = this.sync.genTmpID();
		this.nodes.add({id: tmpId, label: "new", x: sPos.x + _.random(-20, 20), y: sPos.y + _.random(-20, 20)});
		this.edges.add({from: tmpId, to: selection.nodes[0].toString()});
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

		this.network.on("dragEnd", (params) => {
			let selection = this.network.getSelection();
			this.deleteCmdEnabled = (selection.edges.length != 0 || selection.nodes.length != 0);
		});

		this.network.on("doubleClick", (params) => {
			let selection = this.network.getSelection();
			if (selection.nodes.length == 1) {
				this.dlg.open({
					viewModel: "views/dialogs/cell-editor",
					model: selection.nodes[0]
				})
				.then(res => {
					if (!res.wasCancelled) {
						log.info(res.output);
					}
				})
				.catch(err => log.error(err.message));
			}
		});

		// events
		// "selectNode"
		// "selectEdge"
		// "deselectNode"
		// "deselectEdge"
		// "hoverNode"
		// "hoverEdge"
		// "hoverNode"
		// "blurNode"
		// "blurEdge"
		// "click"
		// "doubleClick"
		// "oncontext"
		// "dragStart"
		// "dragging"
		// "zoom"
		// "showPopup"
		// "hidePopup"
	}
}
