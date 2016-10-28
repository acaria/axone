/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";

export interface INeuronModel extends Document {
	_id: string;
	user: string;
	axone: string;
	dentrites: Array<string>;
};

let entitySchema = new Schema({
	_id: 			{ type: Schema.Types.ObjectId, required: true, 	ref: "cell", unique: true, index: true},
	user:			{ type: Schema.Types.ObjectId, required: true, 	ref: "user"},
	axone: 		{ type: Schema.Types.ObjectId, required: false, ref: "cell"},
	dentrites: [{ type: Schema.Types.ObjectId, required: false, ref: "cell"}]
}).pre("save", function(next: () => void) {
	next();
	return this;
});

let modelSchema = model<INeuronModel>("neuron", entitySchema, "neurons", true);

export class NeuronRepository extends RepositoryBase<INeuronModel> {
	constructor() {
		super(modelSchema);
	}
}