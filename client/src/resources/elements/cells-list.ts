
import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../../components/prompt';
import {Item, INameID} from '../../models/neuron-item';
import {log} from '../../logger';
import * as _ from 'lodash';

@autoinject()
export class CellsList {
	@bindable items: Array<Item> = [];
	@bindable axone: string = null;

	private editing = new Map<string, Item>();
	private creating:Item = null;
	private apiClient: Rest;

	private neuronsList: Array<INameID>;

	constructor(apiConfig: ApiConfig, private dlg: DialogService) {
		this.apiClient = apiConfig.getEndpoint("api");
		this.apiClient.find('items/nameids')
		.then(items => {
			this.neuronsList = _.sortBy(items, "name") as Array<INameID>;
		})
		.catch(error => log.error(error));
	}

	createCell(name:string) {
		if (!this.creating) {
			this.creating = {_id: 'NEW', name: name, __dendrites: [], __neuron: null};
			this.items.unshift(this.creating);
			this.editing[this.creating._id] = this.creating;
		}
	}

	editCell(id:string) {
		let item = _.find(this.items, {_id: id});
		if (item) {
			this.editing[id] = JSON.parse(JSON.stringify(item));
		}
	}

	saveCell(id:string) {
		let sendData:Object = null;
		let creatingProgress = false;
		if (this.creating && this.creating._id == id) {
			creatingProgress = true;
			sendData = {
				cell: _.pick(this.creating, ["name"]),
				neuron: {
					axone: this.axone,
					dendrites: this.creating.__dendrites
				}
			};
		} else {
			let item = _.find(this.items, {_id: id});
			if (item != null) {
				sendData = {
					cell: _.pick(item, ["name", "_id"]),
					neuron: {
						axone: this.axone,
						dendrites: item.__dendrites
					}
				};
			}
		}

		if (sendData === null) {
			log.error("missing element " + id);
			return;
		}

		this.apiClient.create("items", sendData)
		.then(result => {
			if (result.dendrites) {
				this.neuronsList = _.sortBy(_.unionWith(this.neuronsList, result.dendrites), "name");
			}

			let item = _.find(this.items, {_id: id});
			if (item) {
				item.name = result.cell.name;
				item._id = result.cell._id;
				item.__neuron = result.neuronId;
				item.__dendrites = result.dendrites;
			}

			if (creatingProgress) {
				this.creating = null;
			}
			this.editing[id] = false;
		})
		.catch(error => log.error(error.message));
	}

	cancelCell(id:string) {
		if (this.creating && this.creating._id == id) {
			let index = this.items.indexOf(this.creating);
			this.items.splice(index, 1);
			this.editing[id] = false;
			this.creating = null;
		}
		if (this.editing[id]) {
			for(let cell of this.items) {
				if (cell._id == id) {
					cell.name = this.editing[id].name;
					cell.__dendrites = this.editing[id].__dendrites;
				}
			}
			this.editing[id] = false;
		}
	}

	removeCell(id:string) {
		let item = _.find(this.items, {_id: id});
		if (item != null) {
			this.dlg.open({
				viewModel: Prompt, 
				model: `Are you sure to delete the cell "${item.name}"?`})
			.then(res => {
				if (!res.wasCancelled) {
					this.apiClient.destroy('cells/', item._id)
					.then(() => {
						let index = this.items.indexOf(item);
						var removed = this.items.splice(index, 1);
					})
					.catch(err => log.error(err.message));
				}
			})
			.catch(err => log.error(err.message));
		}
	}
}