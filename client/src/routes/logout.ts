import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Logout {
	auth: AuthService;

	constructor(auth: AuthService) {
		this.auth = auth;
	}

	activate() {
    	this.auth.logout();
 	}
}