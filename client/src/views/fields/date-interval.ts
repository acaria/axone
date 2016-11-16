import {IField} from "./base/field";

export class DateInterval implements IField {
	title = "Date interval";
	type = "date-interval";
	name = "dateinterval";

	private model:Object;

	get start() {
		return this.model[this.name]["start"];
	}

	set start(value) {
		this.model[this.name]["start"] = value;
	}

	get end() {
		return this.model[this.name]["end"];
	}

	set end(value) {
		this.model[this.name]["end"] = value;
	}

	activate(model) {
		this.model = model;
		if (!this.model[this.name]) {
			this.model[this.name] = {};
		}
	}
}