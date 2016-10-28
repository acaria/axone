import {autoinject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../components/prompt';
var log = LogManager.getLogger('neurons');

@autoinject
export default class {
	private heading = "List of neurons";

	axoneId = null;
	arborescence = [];
	cells = [];

	private apiClient: Rest; 

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	private buildArborescence(neuron: any) {
		let index = 0;
		for(let el of this.arborescence) {
			if (el.id == neuron._id._id) {
				log.info(this.arborescence);
				this.arborescence = this.arborescence.slice(0, index);
				log.info(this.arborescence);
				break;
			}
			index++;
		}
		if (index == (this.arborescence.length + 1)) {
			this.arborescence = [];
		}
		this.arborescence.push({
			name: neuron._id.name,
			id: neuron._id._id
		});
	}

	activate(params, routeConfig) {
		this.axoneId = null;
		if (!params.id) {
			this.cells = [];
			this.arborescence = [];
			this.axoneId = null;
			this.apiClient.find('neurons')
			.then(neurons => {
				for (let neuron of neurons) {
					this.cells.push(neuron._id);
				}
			})
			.catch(err => log.error(err));
		} else {
			this.apiClient.findOne('neurons', params.id)
			.then(neuron => {
				this.axoneId = neuron._id._id;
				this.buildArborescence(neuron);
				this.apiClient.find(`neurons?axone=${params.id}`)
				.then(neurons => {
					this.cells = [];
					for (let neuron of neurons) {
						this.cells.push(neuron._id);
					}
				})
				.catch(err => log.error(err));
			})
			.catch(err => log.error(err));
		}
	}
}