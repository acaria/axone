import * as $ from 'jquery';
import * as _ from "lodash"
import "bootstrap-datepicker";

import {bindable, inject, customElement} from "aurelia-framework";
import {bindingMode} from "aurelia-binding";
import {log} from "../../logger";

@customElement("date-range")
export class DateRange {
	@bindable({defaultBindingMode: bindingMode.twoWay})
	@bindable options: Object;
	@bindable start;
	@bindable end;
	
	private dateRange;
	private dateStart;
	private dateEnd;

	isAttached = false;

	constructor() {}

	attached() {
		if (this.isAttached) {
			return;
		}
		this.isAttached = true;

		let myThis = this;
		$(this.dateRange).datepicker(this.options);

		$(this.dateStart).on("changeDate", function(e) {
			myThis.start = myThis.dateStart.value;
		});

		$(this.dateEnd).on("changeDate", function(e) {
			myThis.end = myThis.dateEnd.value;
		});
	}
}