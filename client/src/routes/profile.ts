import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Profile {
	heading = 'Profile';
	profile: Object;

	constructor(private auth:AuthService) {
		this.profile = null;
	}

	setProfile = data => {
		this.profile = data;
	}

	activate() {
		return this.auth.getMe()
		.then(this.setProfile);
	}

	update() {
		return this.auth.updateMe(this.profile)
		.then(this.setProfile);
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