import { Document, Schema, model} from "mongoose";

import * as neuron from "./neuron";

var debug = require("debug")("ax-server:cell");

export interface ICellModel extends Document {
	name: string;
	user: string;
	properties: Object;
	createdAt: Date;
	modifiedAt: Date;
};

let cellSchema = new Schema({
	name: 		{ type: String, 						required: true},
	user: 		{ type: Schema.Types.ObjectId, 	required: true, ref: "user"},
	properties:	{ type: Schema.Types.Mixed,		required: false},
	createdAt: 	{ type: Date, 							required: false},
	modifiedAt: { type: Date, 							required: false}
});

// cellSchema.virtual("neurons", {
// 	ref: "neuron",
// 	localField: "_id",
// 	foreignField: "cell"
// });

cellSchema.index({user: 1, name: 1}, {unique: true});

cellSchema.pre("save", function(next: () => void) {
	if (!this._doc) {
		next();
		return this;
	}

	let doc = <ICellModel>this._doc;
	let now = new Date();
	if (!doc.createdAt) {
		doc.createdAt = now;
	}
	doc.modifiedAt = now;

	next();
	return this;
});

export var cellModel = model<ICellModel>("cell", cellSchema, "cells", false);

cellModel.on("index", function(err: any) {
	debug(">>>>>>>>>> todo");
});
