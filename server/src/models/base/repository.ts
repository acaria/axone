/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";

interface IRead<T> {
	findById(id: string, callback: (error: any, result: T) => void): void;
	findOne(cond: Object, callback: (err: any, result: T) => void): void;
	find(cond: Object, callback: (err: any, res: T[]) => void): void;
}

interface IAdminRead<T> {
	findOneP(cond: Object, fields: Object, callback: (err: any, res: T) => void): void;
}

interface IWrite<T> {
	create(item: T, callback: (error: any, result: any) => void): void;
	update(_id: string, item: T, callback: (error: any, result: any) => void): void;
	delete(_id: string, callback: (error: any, result: any) => void): void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T>, IAdminRead<T> {

	private _model: mongoose.Model<mongoose.Document>;

	constructor(schemaModel: mongoose.Model<mongoose.Document>) {
		this._model = schemaModel;
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

	findById(_id: string, callback: (error: any, result: T) => void) {
		this._model.findById(_id, callback);
	}

	findOne(cond: Object, callback: (err: any, res: T) => void) {
		this._model.findOne(cond, callback);
	}

	findOneP(cond: Object, fields: string, callback: (err: any, res: T) => void) {
		this._model.findOne(cond, fields, callback);
	}

	find(cond: Object, callback: (err: any, res: T[]) => void) {
		this._model.find(cond, callback);
	}
}