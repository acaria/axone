
import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../../components/prompt';
import {log} from '../../logger';
import * as _ from 'lodash';

export interface Item {
	_id: string;
	name: string;
	__dendrites: Array<{_id: string, name: string}>;
	__neuron: string;
}

@autoinject()
export class CellsList {
	@bindable items: Array<Item> = [];
	@bindable axone: string = null;


	private editing = {};
	private creating:Item = null;
	private apiClient: Rest;

	private allCells;

	constructor(apiConfig: ApiConfig, private dlg: DialogService) {
		this.apiClient = apiConfig.getEndpoint("api");
		this.apiClient.find('cells', {sort: "name", mode: "nameids"})
		.then(cells => {
			this.allCells = cells;
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
		for(let cell of this.items) {
			if (cell._id == id) {
				this.editing[id] = JSON.parse(JSON.stringify(cell));
			}
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
					dentrites: this.creating.__dendrites
				}
			};
		} else {
			for(let item of this.items) {
				if (item._id == id) {
					sendData = {
						cell: _.pick(item, ["name", "_id"]),
						neuron: {
							axone: this.axone,
							dentrites: item.__dendrites
						}
					};
					break;
				}
			}
		}

		if (sendData === null) {
			log.error("missing element " + id);
			return;
		}

		this.apiClient.create("items", sendData)
		.then(item => {
			this.editing[id]._id = item.cell._id;
			this.editing[id].__neuron = item.neuron._id;
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
				}
			}
			this.editing[id] = false;
		}
	}

	removeCell(id:string) {
		for(let cell of this.items) {
			if (cell._id == id) {
				this.dlg.open({
					viewModel: Prompt, 
					model: `Are you sure to delete the cell "${cell.name}"?`})
				.then(res => {
					if (!res.wasCancelled) {
						this.apiClient.destroy('cells/', cell._id)
						.then(() => {
							let index = this.items.indexOf(cell);
							var removed = this.items.splice(index, 1);
						})
						.catch(err => log.error(err.message));
					}
				})
				.catch(err => log.error(err.message));
			}
		}
	}
}