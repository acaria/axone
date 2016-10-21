import {HttpClient, json} from 'aurelia-fetch-client';
import {autoinject, LogManager} from 'aurelia-framework';
import cfg from './../config';
var log = LogManager.getLogger('HttpClient');

export default class extends HttpClient {
	constructor() {
		super();
		this.configure(config => {
			config
			.withBaseUrl(cfg.server.api)
			.withDefaults({
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'X-Requested-With': 'Fetch'
				}
			})
			.withInterceptor({
				request(request) {
					log.info(`Requesting ${request.method} ${request.url}`);
					return request;
				},
				response(response) {
					log.info(`Received ${response.status} ${response.url}`);
					return response;
				}
			});
		});
	}

	fetchGet(address:string, onSuccess:Function, onError:Function) {
		this.fetch(address)
		.then(r => {
			if (!r.ok) {
				return r.json().then(r2 => {throw new Error(r2.error)});	
			} else {
				return r.json();
			}
		}).then(result => {
			onSuccess(result);
		}).catch(err => {
			onError(err);
		});
	}

	fetchPost(address:string, content:Object, onSuccess:Function, onError:Function) {
		this.fetch(address, {
			method: 'post',
			body: json(content)
		}).then(r => {
			if (!r.ok) {
				return r.json().then(r2 => {throw new Error(r2.error)});	
			} else {
				return r.json();
			}
		}).then(result => {
			onSuccess(result);
		}).catch(err => {
			onError(err);
		});
	}

	fetchPut(address:string, content:Object, onSuccess:Function, onError:Function) {
		this.fetch(address, {
			method: 'put',
			body: json(content)
		}).then(r => {
			if (!r.ok) {
				return r.json().then(r2 => {throw new Error(r2.error)});	
			} else {
				return r.json();
			}
		}).then(result => {
			onSuccess(result);
		}).catch(err => {
			onError(err);
		});
	}

	fetchDelete(address:string, onSuccess:Function, onError:Function) {
		this.fetch(address, {
			method: 'delete'
		}).then(r => {
			if (!r.ok) {
				return r.json().then(r2 => {throw new Error(r2.error)});	
			} else {
				return r.json();
			}
		}).then(result => {
			log.info(result);
			onSuccess(result);
		}).catch(err => {
			onError(err);
		});
	}
}