import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Authentication} from "../ctrls/authentication";
import appCfg from '../app-config';
import {log} from '../logger';

@autoinject()
export class NavBar {
	@bindable router: Router;

	constructor(private auth: Authentication) {}

	created() {}

	@computedFrom('auth.isAuthenticated')
  	get isAuthenticated() {
		return this.auth.isAuthenticated;
	}
}
