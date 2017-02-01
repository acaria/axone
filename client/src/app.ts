import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {AuthenticateStep} from 'aurelia-authentication';

export class App {
	router: Router;

	configureRouter(config: RouterConfiguration, router: Router) {
		config.title = 'Axone';
		config.addPipelineStep('authorize', AuthenticateStep);

		config.map([
			{ route: ['','home'], 		name: 'home', 			moduleId: './routes/home', 			title: 'Home',	nav: true},
			{ route: 'd3-viewer', 		name: 'd3-viewer',	moduleId: './routes/d3-viewer', 		title: 'D3 Viewer', nav: true, auth: true},
			// { route: 'd3-viewer2', 		name: 'd3-viewer2',	moduleId: './routes/d3-viewer2', 	title: 'D3 Viewer', nav: true, auth: true},
			{ route: 'vis-viewer', 		name: 'vis-viewer',	moduleId: './routes/vis-viewer', 	title: 'Vis viewer',	nav: true, auth: true},
			{ route: 'cyt-viewer', 		name: 'cyt-viewer',	moduleId: './routes/cyt-viewer', 	title: 'Cyt viewer',	nav: true, auth: true},
			{ route: 'neurons/:id?', 	name: 'neurons', 		moduleId: './routes/neurons', 		title: 'Neurons',	nav: true, auth: true, href: '#/neurons'},
			{ route: 'cells/:id?', 		name: 'cells', 		moduleId: './routes/cells', 			title: 'Cells', nav: true, auth: true, href: '#/cells' },
			{ route: 'about',				name: 'about', 		moduleId: './routes/about', 			title: 'About', nav: true},

			{ route: 'editor', 			name: 'editor',		moduleId: './routes/cell-editor', 	title: 'Editor', nav: false},
			{ route: 'signup', 			name: 'signup',		moduleId: './routes/signup', 			title: 'Signup', nav: false},
			{ route: 'profile',			name: 'profile', 		moduleId: './routes/profile',			title: 'Profile',	nav: false,	auth: true},
			{ route: 'notfound', 		name: 'notfound', 	moduleId: './routes/notfound', 		title: '404 | Page not found', nav: false}
		]);
		config.mapUnknownRoutes('./routes/notfound');

		this.router = router;
	}
}
