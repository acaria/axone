import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
// import cfgServer from 

export default class extends HttpClient {
	constructor() {
		super();
		this.configure(config => {
			config
			.withBaseUrl('http://localhost:3000/api/')
			.withDefaults({
				credentials: 'same-origin',
				headers: {
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