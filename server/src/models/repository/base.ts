import * as mongoose from "mongoose";

//var debug = require("debug")("ax-server:repository");

interface IRead<T> {
	findOne(cond: Object, fields: Object, options: Object, callback: (err: any, result: T) => void): void;
	find(selector: {_id: string}, fields: Object, options: Object, callback: (err: any, res: T[]) => void): void;
}

interface IWrite<T> {
	create(item: T, callback: (error: any, result: any) => void): void;
	update(selector: {_id: string}, item: T, callback: (error: any, result: any) => void): void;
	delete(selector: {_id: string}, callback: (error: any, result: any) => void): void;
	upsert(selector: Object, item: T, callback: (err: any, isNew: boolean, res: T) => void): void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

	protected _model: mongoose.Model<mongoose.Document>;

	constructor(schemaModel: mongoose.Model<mongoose.Document>) {
		this._model = schemaModel;
	}

	get model(): mongoose.Model<T> {
		return this._model as mongoose.Model<T>;
	}

	create(item: T, callback: (error: any, result: T) => void) {
		this._model.create(item, callback);
	}

	update(selector: {_id: string}, item: T, callback: (err: any, res: T) => void) {
		this._model.findOneAndUpdate(selector, item, {new: true}, callback);
	}

	delete(selector: {_id: string}, callback: (err: any, res: any) => void) {
		this._model.remove(selector, (err) => callback(err, null));
	}

	findOne(cond: Object, fields: Object, options: Object, callback: (err: any, res: T) => void) {
		this._model.findOne(cond, fields, options, callback);
	}

	find(selector: {_id: string}, fields: Object, options: Object, callback: (err: any, res: T[]) => void) {
		this._model.find(selector, fields, options, callback);
	}

	upsert(selector: Object, item: T, callback: (err: any, isNew: boolean, res: T | null) => void) {
		this._model.findOne(selector).exec()
		.then(result => {
			if (result === null) {
				throw new Error("missing");
			}
			this._model.findOneAndUpdate(selector, item, {new: true, upsert: false, runValidators: true}).exec()
			.then(result => {
				callback(null, false, result as T);
			})
			.catch(error => {
				callback(error, false, null);
			});
		})
		.catch(error => {
			this._model.findOneAndUpdate(selector, item, {runValidators: true, new: true, upsert: true, setDefaultsOnInsert: true}).exec()
			.then(result => {
				callback(null, true, result as T);
			})
			.catch(error => {
				callback(error, true, null);
			});
		});
	}
}