import {autoinject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import AxApiClient from '../services/ax-api-client';
import {Prompt} from '../components/prompt';
var log = LogManager.getLogger('cells');

@autoinject
export default class {
	isLoading: boolean = true;
	editing = {};
	creating:any = false;
	cells = [];

	constructor(private http: AxApiClient, private dlg: DialogService) { }

	activate(params, routeConfig) {
		this.isLoading = true;
		this.http.fetch('')
		.then(response => response.json())
		.then(cells => {
			this.cells = cells;
			this.isLoading = false;
		})
		.catch(err => {
			console.log(err);
			this.isLoading = false;
		});
	}

	createCell(name:string) {
		if (!this.creating) {
			this.creating = {_id: 'NEW', name: name}
			this.cells.unshift(this.creating);
			this.editing[this.creating._id] = this.creating;
		}
	}

	editCell(id:number) {
		log.debug('pouet');
		for(let cell of this.cells) {
			if (cell._id == id) {
				this.editing[id] = JSON.parse(JSON.stringify(cell));
			}
		}
	}

	saveCell(id:number) {
		if (this.creating && this.creating._id == id) {

		}
		for(let cell of this.cells) {
			if (cell._id == id) {
				this.editing[id] = false;
			}
		}
	}

	cancelCell(id:number) {
		if (this.creating && this.creating._id == id) {
			let index = this.cells.indexOf(this.creating);
			this.cells.splice(index, 1);
			this.editing[id] = false;
			this.creating = false;
		}
		if (this.editing[id]) {
			for(let cell of this.cells) {
				if (cell._id == id) {
					cell.name = this.editing[id].name;
				}
			}
			this.editing[id] = false;
		}
	}

	removeCell(id:number) {
		for(let cell of this.cells) {
			if (cell._id == id) {
				this.dlg.open({
					viewModel: Prompt, 
					model: `Are you sure to delete the cell "${cell.name}"?`})
				.then(res => {
					if (!res.wasCancelled) {
						let index = this.cells.indexOf(cell);
						this.cells.splice(index, 1);
					}
				})
			}
		}
	}
}