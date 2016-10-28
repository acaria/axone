/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";

export interface ICellModel extends Document {
	name: string;
	user: string;
	createdAt: Date;
	modifiedAt: Date;
};

let entitySchema = new Schema({
	name: 		{ type: String, 						required: true},
	user: 		{ type: Schema.Types.ObjectId, 	required: true, ref: "user"},
	createdAt: 	{ type: Date, 							required: false},
	modifiedAt: { type: Date, 							required: false}
}).pre("save", function(next: () => void) {
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

let modelSchema = model<ICellModel>("cell", entitySchema, "cells", true);

export class CellRepository extends RepositoryBase<ICellModel> {
	constructor() {
		super(modelSchema);
	}
}