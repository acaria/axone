import {bindable, autoinject, BindingEngine} from "aurelia-framework";

@autoinject()
export class NavBar {
	@bindable router;

	constructor(private bindingEngine: BindingEngine) {

	}
}