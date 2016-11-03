/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";

export interface INeuronModel extends Document {
	cell: string;
	user: string;
	axone: string;
	dendrites: Array<string>;
};

let entitySchema = new Schema({
	cell: 		{ type: Schema.Types.ObjectId, required: true, 	ref: "cell", index: true},
	user:			{ type: Schema.Types.ObjectId, required: true, 	ref: "user", index: true},
	axone: 		{ type: Schema.Types.ObjectId, required: false, ref: "neuron", index: true},
	dendrites: [{ type: Schema.Types.ObjectId, required: false, ref: "neuron"}]
}).pre("save", function(next: () => void) {
	next();
	return this;
});

let modelSchema = model<INeuronModel>("neuron", entitySchema, "neurons", true);

export class NeuronRepository extends RepositoryBase<INeuronModel> {
	constructor() {
		super(modelSchema);
	}

	update(selector: {_id: string, user: string}, item: INeuronModel, callback: (err: any, res: INeuronModel) => void) {
		this._model.findOneAndUpdate(selector, item, {new: true}, callback);
	}

	delete(selector: {_id: string, user: string}, callback: (err: any, res: any) => void) {
		this._model.remove(selector, (err) => callback(err, null));
	}
}