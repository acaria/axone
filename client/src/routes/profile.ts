import {autoinject, bindable} from 'aurelia-framework';
import {FetchConfig} from 'aurelia-authentication';
import {Authentication} from '../ctrls/authentication';
import {HttpClient} from 'aurelia-fetch-client';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';

@autoinject()
export class Profile {
	heading = 'Profile';
	
	avatarFiles;
	avatarImg: string | null = null;

	private avatarUrl: string;
	private client: HttpClient;

	constructor(private auth:Authentication, private fetch:FetchConfig) {
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

	activate() {
		this.avatarImg = null;
		this.fetch.configure(this.client);

		if (this.auth.profile != null) {
			this.updateAvatarUrl();
		}
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
				if (this.auth.profile != null) {
					this.auth.profile["avatar"] = result["avatar"];
					this.updateAvatarUrl();
					myThis.avatarImg = null;
				}
			});
		}
		return this.auth.updateProfile();
	}

	logout() {
		this.auth.logout();
	}

	link(provider) {
		return this.auth.link(provider);
	}

	unlink(provider) {
		return this.auth.unlink(provider);
	}

	private updateAvatarUrl() {
		if (this.auth.profile != null) {
			this.avatarUrl = `avatar/${this.auth.profile["avatar"]}`;
		}
	}
}
