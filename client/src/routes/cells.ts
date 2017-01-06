import {bindable, autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {Prompt} from '../views/dialogs/prompt';
import {log} from '../logger';

@autoinject
export default class {
	private heading;
	
	private cells = [];

	//pagination
	private nbItems:number;
	private itemsPerPages = 10;
	@bindable private currentPage = 1;

	private apiClient: Rest;

	constructor(apiConfig: ApiConfig) {
		this.apiClient = apiConfig.getEndpoint("api");
		this.heading = "Cells list";
	}

	currentPageChanged(newValue, oldValue) {
		this.loadItems();
	}

	private asyncLoadItems():Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				this.apiClient.find("cells", {limit: this.itemsPerPages, page: this.currentPage})
				.then(cells => {
					this.cells = cells;
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
				this.apiClient.find("cells/count")
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

	private loadItems() {
		this.asyncCountItems()
		.then(() => this.asyncLoadItems())
		.catch(error => {
			log.error(error);
		});
	}

	activate(params, routeConfig) {
		this.asyncCountItems()
		.then(() => this.asyncLoadItems())
		.catch(error => {
			log.error(error);
		});
	}
}
