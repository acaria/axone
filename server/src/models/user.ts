/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";
import bcrypt = require("bcryptjs");

export interface IUserModel extends Document {
	email: string;
	password: string;
	name: string;
	isAdmin: boolean;
	createdAt: Date;
	modifiedAt: Date;
};

let entitySchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		select: false,
		required: true
	},
	name: {
		type: String,
		require: false
	},
	createdAt: {
		type: Date,
		required: false
	},
	modifiedAt: {
		type: Date,
		required: false
	}
});

entitySchema.pre("save", function(next: () => void) {
	if (this._doc) {
		let doc = <IUserModel>this._doc;
		let now = new Date();
		if (!doc.createdAt) {
			doc.createdAt = now;
		}
		doc.modifiedAt = now;

		if (this.isModified("password")) {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(doc.password, salt, (err, hash) => {
					doc.password = hash;
					next();
				});
			});
		}
	}
	next();
	return this;
});

entitySchema.methods.comparePassword = function(password: string, done: (err: Error, isMatch: boolean) => void) {
	bcrypt.compare(password, this.password, function(err: Error, isMatch: boolean) {
		done(err, isMatch);
	});
};

let modelSchema = model<IUserModel>("user", entitySchema, "users", true);

export class UserRepository extends RepositoryBase<IUserModel> {
	constructor() {
		super(modelSchema);
	}
}