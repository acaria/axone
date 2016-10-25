import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {AuthService} from "aurelia-authentication";

@autoinject()
export class NavBar {
	@bindable router: Router;

	constructor(private auth: AuthService) {}

	@computedFrom('auth.authenticated')
  	get isAuthenticated() {
		return this.auth.authenticated;
	}
}