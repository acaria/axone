import {inject} from 'aurelia-framework';
import AxApiClient from '../services/ax-api-client';

@inject(AxApiClient)
export default class {
	isLoading: boolean = true;
	cells = [];

	constructor(private http: AxApiClient) { }

	activate(params, routeConfig) {
		this.isLoading = true;
		this.http.fetch('')
			.then(response => response.json()).then(cells => {
				this.cells = cells
				this.isLoading = false;
			})
			.catch(err => {
				console.log(err);
				this.isLoading = false;
			});
	} 
}