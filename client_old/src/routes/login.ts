import {autoinject} from 'aurelia-framework';
import {Authentication} from '../ctrls/authentication';

@autoinject()
export class Login {

	constructor(private auth: Authentication) {
	}

	heading  = 'Login';

	email    = '';
	password = '';

	login() {
		return this.auth.login(this.email, this.password);
	}

	authenticate(name) {
		return this.auth.link(name);
	}
}