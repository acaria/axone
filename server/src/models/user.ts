/// <reference path="../_all.d.ts" />
"use strict";

import { Document, Schema, model} from "mongoose";
import { RepositoryBase } from "./base/repository";
import bcrypt = require("bcryptjs");

var debug = require("debug")("ax-server:user");

export interface IUserModel extends Document {
	email: string;
	password: string;
	name: string;
	avatar: string;
	createdAt: Date;
	modifiedAt: Date;

	comparePassword: (password: string, done: (err: Error, isMatch: boolean) => void) => void;
};

let entitySchema = new Schema({
	email: { type: String, unique: true, required: true},
	password: { type: String, select: false, required: true},
	name: { type: String, require: false},
	avatar: { type: String, require: false},
	createdAt: { type: Date, required: false},
	modifiedAt: { type: Date, required: false}
});

entitySchema.pre("save", function(next: () => void) {
	if (!this._doc) {
		next();
		return this;
	}

	let user = <IUserModel>this._doc;
	let now = new Date();
	if (!user.createdAt) {
		user.createdAt = now;
	}
	user.modifiedAt = now;

	if (!this.isModified("password")) {
		next();
		return this;
	}

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			throw new Error(err.message);
		}
		bcrypt.hash(user.password, salt, (err2, hash) => {
			if (err2) {
				throw new Error(err2.message);
			}
			user.password = hash;
			return next();
		});
	});

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