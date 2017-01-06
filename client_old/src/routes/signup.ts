import {autoinject} from 'aurelia-framework';
import {Authentication} from '../ctrls/authentication';

@autoinject()
export class Signup {

	constructor(private auth: Authentication) { }

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