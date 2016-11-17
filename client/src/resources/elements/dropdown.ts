import * as _ from "lodash"
import {bindable, inject, customElement} from "aurelia-framework";
import {log} from "../../logger";

@customElement("dropdown")
export class Dropdown {
	@bindable itemInfo: {id: string, name: string} = {id: "_id", name: "name"};

	@bindable items = [];
	@bindable selection = null;
	@bindable emptydesc = "Selection";

	private displayTxt;

	getId(value) {
		return value[this.itemInfo.id];
	}

	getName(value) {
		return value[this.itemInfo.name];
	}

	selectionChanged(newValue, oldValue) {
		this.updateDisplay();
	}

	private updateDisplay() {
		try {
			if (this.selection == null) {
				this.displayTxt = this.emptydesc + " ";
			} else {
				let selector = {};
				selector[this.itemInfo.id] = this.selection;
				this.displayTxt = this.getName(_.find(this.items, selector)) + " ";
			}
		} catch (error) {
			log.error(error);
			this.displayTxt = this.emptydesc + " ";
		}
	}

	select(value) {
		this.selection = value;
	}

	attached() {
		this.updateDisplay();
	}
}