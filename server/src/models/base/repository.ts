/// <reference path="../../_all.d.ts" />
"use strict";

import * as mongoose from "mongoose";

interface IRead<T> {
	retrieve: (callback: (error: any, result: any) => void) => void;
	findById: (id: string, callback: (error: any, result: T) => void) => void;
	findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T>;
	find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}

interface IAdminRead<T> {
	findOneP(cond: Object, fields: Object, callback: (err: any, res: T) => void): mongoose.Query<T>;
}

interface IWrite<T> {
	create: (item: T, callback: (error: any, result: any) => void) => void;
	update: (_id: string, item: T, callback: (error: any, result: any) => void) => void;
	delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T>, IAdminRead<T> {

	private _model: mongoose.Model<mongoose.Document>;

	constructor(schemaModel: mongoose.Model<mongoose.Document>) {
		this._model = schemaModel;
	}

	create(item: T, callback: (error: any, result: T) => void) {
		this._model.create(item, callback);
	}

	retrieve(callback: (error: any, result: T) => void) {
		this._model.find({}, callback);
	}

	update(_id: string, item: T, callback: (error: any, result: any) => void) {
		this._model.update({ _id: _id }, item, (error: any, result: any) => {
			if (error || !result) {
				callback(error, result);
			}
			this.findById(_id, callback);
		});
	}

	delete(_id: string, callback: (error: any, result: any) => void) {
		this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
	}

	findById(_id: string, callback: (error: any, result: T) => void) {
		this._model.findById(_id, callback);
	}

	findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T> {
		return this._model.findOne(cond, callback);
	}

	findOneP(cond: Object, fields: string, callback: (err: any, res: T) => void): mongoose.Query<T> {
		return this._model.findOne(cond, fields, callback);
	}

	find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
		return this._model.find(cond, options, callback);
	}

	private toObjectId(_id: string): mongoose.Types.ObjectId {
		return mongoose.Types.ObjectId.createFromHexString(_id);
	}
}