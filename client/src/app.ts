import {Router, RouterConfiguration} from 'aurelia-router';
import {AuthenticateStep} from 'aurelia-authentication';

export class App {
	router: Router;

	configureRouter(config: RouterConfiguration, router: Router){
		config.title = 'Axone';
		config.addPipelineStep('authorize', AuthenticateStep);

		config.map([
			{ route: ['','home'], 		name: 'home', 		moduleId: './routes/home', 		nav: true, 		title: 'Home' },
			{ route: 'cells', 			name: 'cells', 	moduleId: './routes/cells', 		nav: true, 		title: 'Cells', 	auth: true },
			{ route: 'neurons/:id?', 	name: 'neurons', 	moduleId: './routes/neurons', 	nav: true, 		title: 'Neurons', auth: true, href: '#/neurons' },
			{ route: 'about', 			name: 'about', 	moduleId: './routes/about', 		nav: true, 		title: 'About' },

			// { route: 'neurons/:id', 	name: 'neurons', 	moduleId: './routes/neurons', 	nav: false, 	title: 'Neurons', auth: true },
			{ route: 'signup', 			name: 'signup',	moduleId: './routes/signup',		nav: false,		title: 'Signup'},
			{ route: 'login',				name: 'login',		moduleId: './routes/login',		nav: false, 	title: 'Login'},
			{ route: 'logout',			name: 'logout',	moduleId: './routes/logout',		nav: false, 	title: 'Logout'},
			{ route: 'profile',			name: 'profile', 	moduleId: './routes/profile',		nav: false,		title: 'Profile', auth: true},
			{ route: 'notfound', 		name: 'notfound', moduleId: './routes/notfound', 	nav: false, 	title: '404 | Page not found' }
		]);
		config.mapUnknownRoutes('./routes/notfound');

		this.router = router;
	}
}