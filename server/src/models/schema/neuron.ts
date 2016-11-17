/// <reference path="../../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";

export interface INeuronModel extends Document {
	cell: string;
	user: string;
	axone: string;
	dendrites: Array<string>;
};

let neuronSchema = new Schema({
	cell: 		{ type: Schema.Types.ObjectId, required: true, 	ref: "cell", index: true},
	user:			{ type: Schema.Types.ObjectId, required: true, 	ref: "user", index: true},
	axone: 		{ type: Schema.Types.ObjectId, required: false, ref: "neuron", index: true},
	dendrites: [{ type: Schema.Types.ObjectId, required: false, ref: "neuron"}]
}).pre("save", function(next: () => void) {
	next();
	return this;
});

export var neuronModel = model<INeuronModel>("neuron", neuronSchema, "neurons");