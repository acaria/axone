import {bindable, autoinject} from 'aurelia-framework';
import SyncNetwork from '../ctrls/d3-sync-network';
import {log} from '../logger';
import {Neuron} from '../models/neuron-item';
import {RadialTreeview, Node} from '../views/radial-treeview';
import * as _ from 'lodash';

@autoinject()
export default class {
	private treeView: RadialTreeview;

	constructor(private sync: SyncNetwork) {
		this.treeView = new RadialTreeview("#canvas");
	}

	attached() {
		this.treeView.init();

		this.sync.loadNetworkData()
		.then((data) => {
			this.treeView.setData(data);
		})
		.catch(error => {
			log.error(error);
		});
	}
}
