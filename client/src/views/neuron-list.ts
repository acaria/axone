
import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from 'aurelia-api';
import {Item, INameID} from '../models/neuron-item';
import {log} from '../logger';
import * as _ from 'lodash';

@autoinject()
export class NeuronList {
	@bindable items: Array<Item> = [];
	@bindable axone: string = "";

	private editing : Map<string, Item>;
	private creating: Item | null = null;
	private apiClient: Rest;
	private newCellMode:boolean = true;

	private neuronsList: Array<INameID>;
	private unassignedCells: Array<INameID>;
	@bindable unassignedSelection: string = "";

	constructor(apiConfig: ApiConfig, private dlg: DialogService) {
		this.editing = new Map<string, Item>();
		this.apiClient = apiConfig.getEndpoint("api");
	}

	attached() {
		this.loadSelectorLists();
	}

	private loadSelectorLists() {
		this.apiClient.find('items/list', {cat: "neurons"})
		.then(items => {
			this.neuronsList = _.sortBy(items, "name") as Array<INameID>;
		})
		.catch(error => log.error(error));

		this.apiClient.find('items/list', {cat: "ucells"})
		.then(items => {
			this.unassignedCells = _.sortBy(items, "name") as Array<INameID>;
		})
		.catch(error => log.error(error));
	}

	unassignedSelectionChanged(newValue, oldValue) {
		this.newCellMode = false;
	}

	createNeuron(name:string) {
		if (!this.creating) {
			let tmp : Item = {_id: 'NEW', name: name, __dendrites: [], __neuron: null};
			if (!this.newCellMode && this.unassignedSelection) {
				let item = _.find(this.unassignedCells, {_id: this.unassignedSelection});
				if (item && item._id) {
					tmp = {_id: item._id, name: item.name, __dendrites: [], __neuron: null};
				}
			}
			
			this.creating = tmp;
			this.items.unshift(this.creating);
			if (this.creating._id) {
				this.editing[this.creating._id] = this.creating;
			}
		}
	}

	editNeuron(id:string) {
		let item = _.find(this.items, {_id: id});
		if (item) {
			this.editing[id] = JSON.parse(JSON.stringify(item));
		}
	}

	saveNeuron(id:string) {
		let sendData: Object | null = null;
		let creatingProgress = false;
		if (this.creating && this.creating._id == id) {
			creatingProgress = true;
			sendData = {
				cell: _.pick(this.creating, this.newCellMode ? ["name"] : ["name", "_id"]),
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

				//dirty clear unassigned
				let uidx = _.findIndex(this.unassignedCells, {_id: item._id});
				if (uidx >= 0) {
					this.unassignedCells.splice(uidx, 1);
				}
			}

			if (creatingProgress) {
				this.newCellMode = true;
				this.creating = null;
			}
			this.editing[id] = false;
		})
		.catch(error => log.error(error.message));
	}

	cancelNeuron(id:string) {
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

	removeNeuron(id:string) {
		let item = _.find(this.items, {_id: id});
		if (item) {
			this.dlg.open({
				viewModel: "views/dialogs/confirm", 
				model: {
					message: `Are you sure you want to delete the neuron "${item.name}"?`, 
					option: `Also delete the associated cell`,
					precheck: true
				}
			}).then(res => {
				if (!res.wasCancelled && item) {
					let current = item as Item;
					if (res.output) {
						this.apiClient.destroy('cells/', item._id)
						.then(() => {
							let index = this.items.indexOf(current);
							var removed = this.items.splice(index, 1);
							this.loadSelectorLists();
						})
						.catch(err => log.error(err.message));
					} else {
						if (current.__neuron) {
							this.apiClient.destroy("neurons/", current.__neuron)
							.then(() => {
								let index = this.items.indexOf(current);
								var removed = this.items.splice(index, 1);
								this.loadSelectorLists();
							})
						}
					}
			}}).catch(err => log.error(err.message));
		}
	}
}
