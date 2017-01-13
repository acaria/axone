import {bindable, autoinject, computedFrom} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {AuthService} from "aurelia-authentication";
import {log} from '../logger';
import {IEvent, EventDispatcher} from '../models/event-dispatcher';

interface Profile {
	name: string;
	email: string;
	avatar: string | null;
}

@autoinject()
export class Authentication {

	private state: 'ready'|'loading'|'loaded' = 'ready';

	private profile: Profile | null;
	private _onProfileChanged = new EventDispatcher<Authentication, Profile | null>();

	constructor(private auth: AuthService, private events: EventAggregator) {
		this.events.subscribe('authentication-change', authenticated => {
			if (!authenticated) {
				this.setProfile(null);
			} else {
				this.auth.getMe()
				.then(profile => { this.setProfile(profile); });
			}
		});
	}

	async activate() {
		if (this.state === 'ready') {
			this.state = 'loading';
			if (this.auth.authenticated) {
				let profile = await this.auth.getMe();
				this.setProfile(profile);
				this.state = 'loaded';
			}
		}
	}

	get isAuthenticated() {
		return this.auth.authenticated;
	}

	get onProfileChanged(): IEvent<Authentication, Profile | null> {
		return this._onProfileChanged;
	}

	getProfile(): Profile | null {
		if (this.state == 'ready') {
			this.activate();
			return null;
		}
		if (this.state == 'loading') {
			return null;
		}
		return this.profile;
	}

	private setProfile(profile:Object | null) {
		if (profile == null)
			this.profile = null;
		else
			this.profile = {
				name: profile['name'],
				email: profile['email'],
				avatar: profile['avatar']
			};
		this._onProfileChanged.dispatch(this, this.profile);
	}

	setProfileAvatarName(avatar:string) {
		if (this.profile != null) {
			this.profile.avatar = avatar;
		}
		this._onProfileChanged.dispatch(this, this.profile);
	}

	//commands
	//--------

	login(email:string, pass:string) {
		return this.auth.login(email, pass);
	}

	logout() {
		return this.auth.logout();
	}

	link(provider:string) {
		return this.auth.authenticate(provider);
	}

	unlink(provider:string) {
		return this.auth.unlink(provider);
	}

	updateProfile() {
		if (this.profile != null) {
			return this.auth.updateMe(this.profile)
			.then(profile => { this.setProfile(profile); });
		}
	}

	signup(data:Object) {
		return this.auth.signup(data);
	}
}
