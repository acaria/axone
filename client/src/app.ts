import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
	router: Router;

	configureRouter(config: RouterConfiguration, router: Router){
		config.title = 'Axone';
		config.map([
			{ route: ['','home'], name: 'home', moduleId: './routes/home', nav:true, title: 'Home' },
			{ route: ['cells'], name: 'cells', moduleId: './routes/cells', nav:true, title: 'Cells' },
			{ route: ['about'], name: 'about', moduleId: './routes/about', nav:true, title: 'About' },
			{ route: ['notfound'], name: 'notfound', moduleId: './routes/notfound', nav: false, title: '404 | Page not found' }
		]);
		config.mapUnknownRoutes('./routes/notfound');

		this.router = router;
	}
}