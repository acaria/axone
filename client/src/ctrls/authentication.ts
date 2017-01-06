import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';
import {AuthService} from "aurelia-authentication";
import {log} from '../logger';

enum AuthState {
	LOADING,
	READY
}

@autoinject()
export class Authentication {

	private state = AuthState.LOADING;
	profile:Object | null;

	constructor(private auth: AuthService, private event: EventAggregator) {
		if (this.auth.authenticated) {
			this.state = AuthState.LOADING;
			this.auth.getMe()
			.then(profile => {
				this.state = AuthState.READY;
				this.setProfile(profile);
			})
			.catch(error => {
				log.error(error);
				this.state = AuthState.READY;
				this.setProfile(null);
				this.auth.logout();
			});
		}
	}

	get isAuthenticated() {
		return this.auth.authenticated;
	}

	get profileName(): string {
		if (this.state == AuthState.LOADING) {
			return "Connecting...";
		}
		if (this.profile == null) {
			return "Disconnected";
		}
		return this.profile["name"];
	}

	get profileEmail(): string {
		if (this.state == AuthState.LOADING) {
			return "Connecting...";
		}
		if (this.profile == null) {
			return "Disconnected";
		}
		return this.profile["email"];
	}

	get avatarName(): string {
		if (this.state == AuthState.LOADING) {
			return "";
		}
		if (this.profile == null) {
			return "Disconnected";
		}
		return this.profile["avatar"];
	}

	setProfile(profile:Object | null) {
		this.profile = profile;
		this.event.publish("profile-change", this.profile);
	}

	login(email:string, pass:string) {
		return this.auth.login(email, pass)
		.then(() => this.auth.getMe())
		.then(profile => { this.setProfile(profile); });
	}

	logout() {
		return this.auth.logout()
		.then(() => this.setProfile(null));
	}

	link(provider:string) {
		return this.auth.authenticate(provider)
		.then(() => this.auth.getMe())
		.then(profile => { this.setProfile(profile); });
	}

	unlink(provider:string) {
		return this.auth.unlink(provider)
		.then(() => this.auth.getMe())
		.then(profile => { this.setProfile(profile); });
	}

	updateProfile() {
		if (this.profile != null) {
			return this.auth.updateMe(this.profile)
			.then(profile => { this.setProfile(profile); });
		}
	}

	signup(data:Object) {
		return this.auth.signup(data)
		.then(profile => { this.setProfile(profile); });
	}
}
