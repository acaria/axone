import {IField} from "./base/field";

export class Identity implements IField {
	title = "Identity";
	type = "identity";
	name = "identity";

	private model:Object;

	get firstName() {
		return this.model[this.name]["firstname"];
	}
	set firstName(value) {
		this.model[this.name]["firstname"] = value;
	}

	get lastName() {
		return this.model[this.name]["lastname"];
	}
	set lastName(value) {
		this.model[this.name]["lastname"] = value;
	}

	activate(model:Object) {
		this.model = model;
		if (!this.model[this.name]) {
			this.model[this.name] = {};
		}
	}
}