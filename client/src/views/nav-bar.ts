import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from "aurelia-router";
import {Authentication} from "../ctrls/authentication";
import {log} from '../logger';

@autoinject()
export class NavBar {
	@bindable router: Router;

	private profileName:string = "Profile";

	constructor(private auth: Authentication, private event: EventAggregator) {
		this.event.subscribe("profile-change", profile => {
			if (profile) {
				this.profileName = "Logged as " + profile.name;
			} else {
				this.profileName = "Profile";
			}
		});
	}

	created() {
		if (this.auth.isAuthenticated) {
			this.profileName = "Logged as " + this.auth.profileName;
		}
	}

	@computedFrom('auth.isAuthenticated')
  	get isAuthenticated() {
		return this.auth.isAuthenticated;
	}
}