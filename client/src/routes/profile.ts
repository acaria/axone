import {autoinject, bindable} from 'aurelia-framework';
import {FetchConfig} from 'aurelia-authentication';
import {Authentication} from '../ctrls/authentication';
import {HttpClient} from 'aurelia-fetch-client';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import appCfg from '../app-config';

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
			.withBaseUrl(appCfg.endPoint.baseUrl + appCfg.endPoint.auth)
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

	async activate() {
		this.avatarImg = null;
		this.fetch.configure(this.client);

		let profile = this.auth.getProfile();
		if (profile != null && profile.avatar != null) {
			this.avatarUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + profile.avatar;
		} else {
			this.avatarUrl = "images/avatar.svg";
		}
		this.auth.onProfileChanged.sub((sender, profile) => {
			if (profile != null && profile.avatar != null) {
				this.avatarUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + profile.avatar;
			} else {
				this.avatarUrl = "images/avatar.svg";
			} 
		});
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
				this.updateAvatarUrl(result["avatar"]);
				myThis.avatarImg = null;
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

	private updateAvatarUrl(avatarName: string) {
		this.auth.setProfileAvatarName(avatarName);
		this.avatarUrl = appCfg.storage.baseUrl + appCfg.storage.avatar + avatarName;
	}
}
