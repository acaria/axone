import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Login {
	auth: AuthService;

	constructor(auth: AuthService) {
		this.auth = auth;
	}

	heading  = 'Login';

	email    = '';
	password = '';

	login() {
		return this.auth.login(this.email, this.password);
	}

	authenticate(name) {
		return this.auth.authenticate(name);
	}
}