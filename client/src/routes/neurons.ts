import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../components/prompt';
import {log} from '../logger';

interface IArborescence {
	name: string;
	id: string;
}

@autoinject
export default class {
	private heading = "List of neurons";

	axoneId = null;
	arb:Array<IArborescence> = [];
	cells = [];

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
				id: null
			}];
		}
		result.push({
			name: neuron._id.name,
			id: neuron._id._id
		});

		return result;
	}

	activate(params, routeConfig) {
		this.axoneId = null;
		if (!params.id) {
			this.cells = [];
			this.arb = [];
			this.axoneId = null;
			this.apiClient.find('neurons')
			.then(neurons => {
				for (let neuron of neurons) {
					neuron._id.dentrites = [];
					this.cells.push(neuron._id);
				}
			})
			.catch(err => log.error(err));
		} else {
			this.apiClient.findOne('neurons', params.id)
			.then(neuron => {
				this.axoneId = neuron._id._id;
				this.arb = this.buildArb(neuron);
				this.apiClient.find(`neurons?axone=${params.id}`)
				.then(neurons => {
					this.cells = [];
					for (let neuron of neurons) {
						neuron._id.dentrites = [];
						this.cells.push(neuron._id);
					}
				})
				.catch(err => log.error(err));
			})
			.catch(err => log.error(err));
		}
	}
}