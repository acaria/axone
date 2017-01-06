import {IField} from "./base/field";

export class Description implements IField {
	title = "Description";
	type = "description";
	name = "description";

	private model:Object;

	get description() {
		return this.model[this.name];
	}

	set description(value) {
		this.model[this.name] = value;
	}

	activate(model) {
		this.model = model;
	}
}