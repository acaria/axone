import {HttpClient} from 'aurelia-fetch-client';

export class IField {
	title: string;
	name: string;
	type: string;
	preSave?(model: Object, client: HttpClient, list: Array<Promise<any>>): void;
}