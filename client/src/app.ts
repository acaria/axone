import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {AuthenticateStep} from 'aurelia-authentication';

export class App {
	router: Router;

	configureRouter(config: RouterConfiguration, router: Router) {
		config.title = 'Axone';
		config.addPipelineStep('authorize', AuthenticateStep);

		config.map([
			{ route: ['','home'], 		name: 'home', 		moduleId: './routes/home', 			nav: true, 		title: 'Home' },
			{ route: 'viewer', 			name: 'viewer',	moduleId: './routes/viewer', 			nav: true, 		title: 'Viewer',	auth:true},
			{ route: 'neurons/:id?', 	name: 'neurons', 	moduleId: './routes/neurons', 		nav: true, 		title: 'Neurons', auth: true, href: '#/neurons' },
			{ route: 'cells/:id?', 		name: 'cells', 	moduleId: './routes/cells', 			nav: true, 		title: 'Cells', 	auth: true, href: '#/cells' },
			{ route: 'about', 			name: 'about', 	moduleId: './routes/about', 			nav: true, 		title: 'About' },

			{ route: 'editor', 			name: 'editor',	moduleId: './routes/cell-editor', 	nav: false,		title: 'Editor'},
			{ route: 'signup', 			name: 'signup',	moduleId: './routes/signup', 			nav: false,		title: 'Signup'},
			{ route: 'profile',			name: 'profile', 	moduleId: './routes/profile',			nav: false,		title: 'Profile', auth: true},
			{ route: 'notfound', 		name: 'notfound', moduleId: './routes/notfound', 		nav: false, 	title: '404 | Page not found' }
		]);
		config.mapUnknownRoutes('./routes/notfound');

		this.router = router;
	}
}
