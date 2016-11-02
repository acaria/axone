/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";

interface IRead<T> {
	findOne(cond: Object, fields: Object, options: Object, callback: (err: any, result: T) => void): void;
	find(cond: Object, fields: Object, options: Object, callback: (err: any, res: T[]) => void): void;
}

interface IWrite<T> {
	create(item: T, callback: (error: any, result: any) => void): void;
	update(_id: string, item: T, callback: (error: any, result: any) => void): void;
	delete(_id: string, callback: (error: any, result: any) => void): void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

	private _model: mongoose.Model<mongoose.Document>;

	constructor(schemaModel: mongoose.Model<mongoose.Document>) {
		this._model = schemaModel;
	}

	get model(): mongoose.Model<T> {
		return this._model as mongoose.Model<T>;
	}

	create(item: T, callback: (error: any, result: T) => void) {
		this._model.create(item, callback);
	}

	update(_id: string, item: T, callback: (error: any, result: any) => void) {
		this._model.findOneAndUpdate({ _id: _id }, item, {new: true}, callback);
	}

	delete(_id: string, callback: (error: any, result: any) => void) {
		this._model.remove({ _id: _id }, (err) => callback(err, null));
	}

	findOne(cond: Object, fields: Object, options: Object, callback: (err: any, res: T) => void) {
		this._model.findOne(cond, fields, options, callback);
	}

	find(cond: Object, fields: Object, options: Object,  callback: (err: any, res: T[]) => void) {
		this._model.find(cond, fields, options, callback);
	}
}