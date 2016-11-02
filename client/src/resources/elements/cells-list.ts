
import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../../components/prompt';
import {log} from '../../logger';

export interface DendriteItem {
	_id: string,
	name: string
}

export interface Item {
	_id: string;
	name: string;
	dendrites: Array<DendriteItem>;
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
			this.creating = {_id: 'NEW', name: name, dendrites: []};
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
		if (this.creating && this.creating._id == id) {
			let sendData = {
				name: this.creating.name,
				axone: this.axone
			};
			this.apiClient.create('cells', sendData)
			.then(cell => {
				this.creating.name = cell.name;
				this.creating._id = cell._id;
				this.creating = null;
				for(let cell of this.items) {
					if (cell._id == id) {
						this.editing[id] = false;
					}
				}
			})
			.catch(err => log.error(err.message));
		} else {
			for(let cell of this.items) {
				if (cell._id == id) {
					let sendData = {
						name: cell.name,
						axone: this.axone
					};
					this.apiClient.update('cells', cell._id, sendData)
					.then(cell => {
						this.editing[id] = false;
					})
					.catch(err => log.error(err.message));		
				}
			}
		}
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