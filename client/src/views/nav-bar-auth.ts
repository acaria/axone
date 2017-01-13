import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {Authentication} from "../ctrls/authentication";
import appCfg from '../app-config';
import {log} from '../logger';

@autoinject()
export class NavBarAuth {
	private profileName:string = "Profile";
	private profileUrl:string = "";

	email = '';
	password = '';

	constructor(private auth: Authentication) {
		this.auth.onProfileChanged.sub((sender, profile) => {
			if (profile != null) {
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
			let profile = this.auth.getProfile();
			if (profile != null) {
				this.profileName = "Logged as " + profile.name;
				this.profileUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + profile.avatar;
			} else {
				this.profileName = "Profile";
				this.profileUrl = `images/avatar.svg`;
			}
		}
	}

	@computedFrom('auth.isAuthenticated')
  	get isAuthenticated() {
		return this.auth.isAuthenticated;
	}

	login() {
		return this.auth.login(this.email, this.password)
		.then(() => {
			$('[data-toggle="dropdown"]').parent().removeClass('open');
		});
	}

	authenticate(name) {
		return this.auth.link(name);
	}
}
