import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../components/prompt';
import {log} from '../logger';
import {Item} from '../models/neuron-item';

interface IArborescence {
	name: string;
	id: string;
	disabled: boolean;
}

@autoinject
export default class {
	private heading = "List of neurons";

	axoneId = null;
	arb:Array<IArborescence> = [];
	items:Array<Item> = [];

	private apiClient: Rest; 

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	private buildArb(neuron: any): Array<IArborescence> {
		log.debug(this.arb);
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

	private createItem(neuron):Item {
		let dendrites: Array<{_id: string, name: string}> = [];
		if (neuron.dendrite) {
			for(let d of neuron.dendrites) {
				dendrites.push({
					_id: d._id,
					name: d.name
				});
			}
		}
		return {
			_id: neuron.cell._id,
			name: neuron.cell.name,
			__dendrites: neuron.dendrites,
			__neuron: neuron._id
		};
	}

	activate(params, routeConfig) {
		this.axoneId = null;
		if (!params.id) {
			this.items = [];
			this.arb = [];
			this.axoneId = null;
			this.apiClient.find('items')
			.then(items => this.items = items)
			.catch(err => log.error(err));
		} else {
			this.apiClient.findOne('neurons', params.id)
			.then(neuron => {
				this.axoneId = neuron._id;
				this.arb = this.buildArb(neuron);
				this.apiClient.find('items', {axone: params.id})
				.then(items => this.items = items)
				.catch(err => log.error(err));
			})
			.catch(err => log.error(err));
		}
	}
}