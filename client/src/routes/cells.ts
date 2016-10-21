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
		this.http.fetchGet('cells', 
			cells => {
				this.cells = cells;
				this.isLoading = false;
			},
			error => {
				log.error(error);
				this.isLoading = false;
			}
		);
	}

	createCell(name:string) {
		if (!this.creating) {
			this.creating = {_id: 'NEW', name: name}
			this.cells.unshift(this.creating);
			this.editing[this.creating._id] = this.creating;
		}
	}

	editCell(id:number) {
		for(let cell of this.cells) {
			if (cell._id == id) {
				this.editing[id] = JSON.parse(JSON.stringify(cell));
			}
		}
	}

	saveCell(id:number) {
		if (this.creating && this.creating._id == id) {
			var sendData = {
				name: this.creating.name
			};
			this.http.fetchPost('cells', sendData, 
				cell => {
					this.creating.name = cell.name;
					this.creating._id = cell._id;
					this.creating = false;
					for(let cell of this.cells) {
						if (cell._id == id) {
							this.editing[id] = false;
						}
					}
				},
				err => { log.error(err.message) }
			);
		} else {
			for(let cell of this.cells) {
				if (cell._id == id) {
					var sendData = {
						name: cell.name
					};
					this.http.fetchPut('cells/' + cell._id, sendData, 
						cell => {
							this.editing[id] = false;
						},
						err => { log.error(err.message) }
					);		
				}
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
						this.http.fetchDelete('cells/' + cell._id,
							result => {
								let index = this.cells.indexOf(cell);
								var removed = this.cells.splice(index, 1);
							},
							error => {}
						);
					}
				})
			}
		}
	}
}