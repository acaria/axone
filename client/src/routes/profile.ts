import {autoinject, bindable} from 'aurelia-framework';
import {AuthService, FetchConfig} from 'aurelia-authentication';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';

@autoinject()
export class Profile {
	heading = 'Profile';
	profile: Object;
	
	avatarFiles;
	avatarImg = null;

	private client: HttpClient;

	constructor(private auth:AuthService, private event:EventAggregator, private fetch:FetchConfig) {
		this.profile = null;
		this.client = new HttpClient();

		this.client.configure(config => { config
			.withBaseUrl("auth/")
			.withDefaults({
				credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            }
			});
		});
	}

	onSelectAvatar(e) {
		e.cancelBubble = true;
		if (this.avatarFiles.length > 0) {
			this.avatarImg = URL.createObjectURL(this.avatarFiles.item(0));
		}
	}

	removeAvatar(e) {
		e.cancelBubble = true;
		this.avatarImg = null;
		this.avatarFiles = null;
	}

	setProfile = data => {
		this.profile = data;
		this.event.publish("profile-change", this.profile);
	}

	activate() {
		this.fetch.configure(this.client);

		return this.auth.getMe()
		.then(this.setProfile);
	}

	save() {
		if (this.avatarImg != null) {
			var myThis = this;
			let data = new FormData();
			data.append("file", this.avatarFiles.item(0));
			this.client.fetch("avatar", {
				method: "post",
				body: data
			})
			.then(response => response.json())
			.then(result => {
				myThis.profile["avatar"] = result["avatar"];
				myThis.avatarImg = null;
			});
		}
		return this.auth.updateMe(this.profile)
		.then(this.setProfile);
	}

	logout() {
		this.auth.logout();
	}

	link(provider) {
		return this.auth.authenticate(provider)
		.then(() => this.auth.getMe())
		.then(this.setProfile)
	}

	unlink(provider) {
		return this.auth.unlink(provider)
		.then(() => this.auth.getMe())
		.then(this.setProfile)
	}
}