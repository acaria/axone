import {autoinject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../components/prompt';
var log = LogManager.getLogger('cells');

@autoinject
export default class {
	isLoading: boolean = true;
	cells = [];

	private apiClient: Rest; 

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
	}

	activate(params, routeConfig) {
		this.isLoading = true;
		this.apiClient.find('cells')
		.then(cells => {
			this.cells = cells;
			this.isLoading = false;
		})
		.catch(err => {
			log.error(err);
			this.isLoading = false;
		});
	}
}