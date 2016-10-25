import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Signup {

	constructor(private auth: AuthService) { }

	heading = 'Sign Up';

	email = '';
	password = '';
	displayName = '';

	signup() {
		return this.auth.signup({
			displayName: this.displayName,
			email: this.email,
			password: this.password
		});
	}
}