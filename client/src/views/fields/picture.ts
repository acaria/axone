import {autoinject, bindable, customElement} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {IField} from "./base/field";
import {log} from '../../logger';
import * as _ from 'lodash';

@autoinject()
@customElement('picture')
export class Picture implements IField {
	title = "Picture";
	type = "picture";
	name = "picture";

	private model:Object;
	private imgFiles;
	private img: string | null = null;
	private original: string;

	private pictureUrl: string;

	onSelectPicture(e) {
		e.cancelBubble = true;
		if (this.imgFiles.length > 0) {
			this.picture = this.imgFiles.item(0);
			this.img = URL.createObjectURL(this.imgFiles.item(0));
		}
	}

	onRemovePicture(e) {
		e.cancelBubble = true;
		this.picture = null;
		this.img = null;
	}

	private set picture(value) {
		this.model[this.name] = value;
	}

	activate(model) {
		this.model = model;
		this.original = `picture/${model[this.name]}`;
	}

	preSave(model: Object, client: HttpClient, list: Array<Promise<any>>) {
		if (model[this.name] != null) {
			let myThis = this;
			let data = new FormData();
			data.append("file", model[this.name]);
			list.push(new Promise((resolve, reject) => {
				try {
					client.fetch("picture", {
						method: "post",
						body: data
					})
					.then(response => response.json())
					.then(result => {
						model[myThis.name] = result["picture"];
						resolve();
					})
					.catch(error => {
						reject(error);
					});
				} catch (error) {
					reject(error);
				}
			}));
		}
	}
}
