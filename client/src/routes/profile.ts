import {autoinject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject()
export class Profile {
	heading = 'Profile';
	profile: Object;

	constructor(private auth:AuthService, private event:EventAggregator) {
		this.profile = null;
	}

	setProfile = data => {
		this.profile = data;
		this.event.publish("profile-change", this.profile);
	}

	activate() {
		return this.auth.getMe()
		.then(this.setProfile);
	}

	save() {
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