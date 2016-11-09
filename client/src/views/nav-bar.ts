import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from "aurelia-router";
import {AuthService} from "aurelia-authentication";
import {log} from '../logger';

@autoinject()
export class NavBar {
	@bindable router: Router;

	private profileName:string = "Profile";

	constructor(private auth: AuthService, private event: EventAggregator) {
		this.event.subscribe("profile-change", profile => {
			if (profile) {
				this.profileName = "Logged as " + profile.name;
			} else {
				this.profileName = "Profile";
			}
		});

		if (auth.authenticated) {
			this.auth.getMe()
			.then(profile => {
				this.profileName = "Logged as " + profile.name;
			})
		}
	}

	@computedFrom('auth.authenticated')
  	get isAuthenticated() {
		return this.auth.authenticated;
	}
}