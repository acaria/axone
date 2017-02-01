
import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from './dialogs/prompt';
import {INameID} from '../models/neuron-item';
import {log} from '../logger';
import * as _ from 'lodash';

@autoinject()
export class CellList {
	@bindable items: Array<INameID> = [];

	private creating: INameID | null = null;
	private apiClient: Rest;

	constructor(apiConfig: ApiConfig, private dlg: DialogService) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	createCell(name:string) {
		if (!this.creating) {
			this.creating = {_id: 'NEW', name: name};
			this.items.unshift(this.creating);
		}
	}

	saveCell(id:string) {
		let sendData:Object | null = null;
		let creatingProgress = false;
		if (this.creating && this.creating._id == id) {
			creatingProgress = true;
			sendData = {
				name: this.creating.name
			};
		}

		if (sendData === null) {
			log.error("missing element " + id);
			return;
		}

		this.apiClient.create("cells", sendData)
		.then(result => {
			let item = _.find(this.items, {_id: id});
			if (item) {
				item.name = result.name;
				item._id = result._id;
			}

			if (creatingProgress) {
				this.creating = null;
			}
		})
		.catch(error => log.error(error.message));
	}

	cancelCell(id:string) {
		if (this.creating && this.creating._id == id) {
			let index = this.items.indexOf(this.creating);
			this.items.splice(index, 1);
			this.creating = null;
		}
	}

	removeCell(id:string) {
		let find = _.find(this.items, {_id: id});
		if (find) {
			let item = find as INameID;
			this.dlg.open({
				viewModel: "views/dialogs/prompt", 
				model: `Are you sure to delete the cell "${item.name}"?`})
			.then(res => {
				if (!res.wasCancelled && item._id) {
					this.apiClient.destroy('cells/', item._id)
					.then(() => {
						let index = this.items.indexOf(item as INameID);
						var removed = this.items.splice(index, 1);
					})
					.catch(err => log.error(err.message));
				}
			})
			.catch(err => log.error(err.message));
		}
	}
}
