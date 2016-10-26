import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Signup {

	constructor(private auth: AuthService) { }

	heading = 'Sign Up';

	email = '';
	password = '';
	name = '';

	signup() {
		return this.auth.signup({
			name: this.name,
			email: this.email,
			password: this.password
		});
	}
}