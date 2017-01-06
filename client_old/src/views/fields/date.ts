import {IField} from "./base/field";

export class Date implements IField {
	title = "Date";
	type = "date";
	name = "date";

	private model:Object;

	get date() {
		return this.model[this.name];
	}

	set date(value) {
		this.model[this.name] = value;
	}

	activate(model) {
		this.model = model;
	}
}