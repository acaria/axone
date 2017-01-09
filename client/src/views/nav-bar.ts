import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from "aurelia-router";
import {Authentication} from "../ctrls/authentication";
import appCfg from '../app-config';
import {log} from '../logger';

@autoinject()
export class NavBar {
	@bindable router: Router;

	private profileName:string = "Profile";
	private profileUrl:string = "";

	constructor(private auth: Authentication, private event: EventAggregator) {
		this.event.subscribe("profile-change", profile => {
			log.info(profile);
			if (profile) {
				this.profileName = "Logged as " + profile.name;
				this.profileUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + profile.avatar;
			} else {
				this.profileName = "Profile";
				this.profileUrl = `images/avatar.svg`;
			}
		});
	}

	created() {
		if (this.auth.isAuthenticated) {
			this.profileName = "Logged as " + this.auth.profileName;
			this.profileUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + this.auth.avatarName;
		}
	}

	@computedFrom('auth.isAuthenticated')
  	get isAuthenticated() {
		return this.auth.isAuthenticated;
	}
}
