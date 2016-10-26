/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";

export interface INeuronModel extends Document {
	_cell: string;
	axone: string;
	dentrites: Array<string>;
};

let entitySchema = new Schema({
	_cell: { type: Schema.Types.ObjectId, required: true, ref: "cell"},
	axone: { type: Schema.Types.ObjectId, ref: "cell"},
	dentrites: [{ type: Schema.Types.ObjectId, ref: "cell"}]
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