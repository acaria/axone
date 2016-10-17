import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

import cfg from './../config'; 

export default class extends HttpClient {
	constructor() {
		super();
		this.configure(config => {
			config
			.withBaseUrl(cfg.server.api)
			.withDefaults({
				credentials: 'same-origin',
				headers: {
					// 'Access-Control-Allow-Origin': 'http://localhost/',
					// 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    				// 'Access-Control-Allow-Headers': 'Content-type,Accept,X-Custom-Header',
					'Accept': 'application/json',
					'X-Requested-With': 'Fetch'
				}
			})
			.withInterceptor({
				request(request) {
					console.log(`Requesting ${request.method} ${request.url}`);
					return request;
				},
				response(response) {
					console.log(`Received ${response.status} ${response.url}`);
					return response;
				}
			});
		});
	}
};