import * as $ from 'jquery';
import * as _ from "lodash"
import "bootstrap-datepicker";

import {bindable, inject, customElement} from "aurelia-framework";
import {bindingMode} from "aurelia-binding";
import {log} from "../../logger";

@customElement("date-picker")
@inject(Element)
export class DatePicker {
	@bindable({defaultBindingMode: bindingMode.twoWay})
	@bindable options: Object;
	@bindable value;
	
	private datepicker;

	isAttached = false;

	constructor(private element) {}

	attached() {
		if (this.isAttached) {
			return;
		}
		this.isAttached = true;

		let myThis = this;
		$(this.datepicker).datepicker(this.options)
		.on("changeDate", function(e) {
			myThis.value = myThis.datepicker.value;
			let changeDateEvent = new CustomEvent('changedate', {detail: {event: e}, bubbles: true});
			myThis.element.dispatchEvent(changeDateEvent);
		});
	}
}