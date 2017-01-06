import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../views/dialogs/prompt';
import {log} from '../logger';
import {Item} from '../models/neuron-item';

interface IArborescence {
	name: string;
	id: string | null;
	disabled: boolean;
}

@autoinject
export default class {
	private heading;

	//group by axones
	private axoneId: string | null = null;
	private arb:Array<IArborescence> = [];
	
	private items:Array<Item> = [];

	//pagination
	private nbItems:number;
	private itemsPerPages = 10;
	@bindable private currentPage = 1;

	private apiClient: Rest;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
		this.heading = "Neurons list";
	}

	currentPageChanged(newValue, oldValue) {
		this.loadItems();
	}

	private buildArb(neuron: any): Array<IArborescence> {
		let found = false; 
		let result:Array<IArborescence> = [];

		if (neuron.axone) {
			for(let el of this.arb) {
				el.disabled = false;
				result.push(el);
				if (el.id == neuron.axone._id) {
					found = true;
					break;
				}
			}
		}
		if (!found && neuron.axone) {
			result = [{
				name: "...",
				id: null,
				disabled: true
			}];
		}
		result.push({
			name: neuron.cell.name,
			id: neuron._id,
			disabled: true
		});

		return result;
	}

	private asyncLoadItems():Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				this.apiClient.find("items", {axone: this.axoneId, limit: this.itemsPerPages, page: this.currentPage})
				.then(items => {
					this.items = items;
					resolve();
				})
				.catch(err => {
					log.error(err);
					reject(err);
				});
			} catch(err) {
				reject(err);
			}
		});
	}

	private asyncCountItems():Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				this.apiClient.find("neurons/count", {axone: this.axoneId})
				.then(result => {
					this.nbItems = result.count;
					resolve();
				})
				.catch(err => {
					log.error(err);
					reject(err);
				});
			} catch(err) {
				reject(err);
			}
		}); 
	}

	private asyncPreLoadItems():Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				if (!this.axoneId) {
					this.items = [];
					this.arb = [];
					resolve();
				} else {
					this.apiClient.findOne("neurons", this.axoneId)
					.then(neuron => {
						this.arb = this.buildArb(neuron);
						resolve();
					})
					.catch(err => {
						reject(err);
					});
				}
			} catch(err) {
				reject(err);
			}
		}); 
	}

	private loadItems() {
		this.asyncCountItems()
		.then(() => this.asyncLoadItems())
		.catch(error => {
			log.error(error);
		});
	}

	activate(params, routeConfig) {
		this.axoneId = params.id;
		this.asyncCountItems()
		.then(() => this.asyncPreLoadItems())
		.then(() => this.asyncLoadItems())
		.catch(error => {
			log.error(error);
		});
	}
}
