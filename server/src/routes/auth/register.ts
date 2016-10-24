/// <reference path="../../_all.d.ts" />
"use strict";

import moment = require("moment");
import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../models/user";
import jwt = require("jwt-simple");

var cfg = require("../../../config.js");
var debug = require("debug")("ax-server:auth");

export class Register {
	constructor(private repo: UserRepository) {}

	private debugRepositoryError(err: any) {
		if (err && err.name === "ValidationError") {
			for (var field in err.errors) {
				if (err.errors.hasOwnProperty(field)) {
					debug(err.errors[field].message);
					break;
				}
			}
		} else {
			debug(err.message);
		}
	}

	signup(req: Request, res: Response) {
		this.repo.findOne({email: req.body.email}, (err, oldUser) => {
			if (oldUser) {
				return res.status(409).send({error: "email already exists"});
			}

			this.repo.create(req.body, (err2, newUser) => {
				if (err2) {
					this.debugRepositoryError(err2);
					return res.status(400).send({error: "error"});
				}
				return res.status(201).send(newUser);
			});
		});
	}

	login(req: Request, res: Response) {
		this.repo.findOneP({email: req.body.email}, "+password", (err, user) => {
			if (!user) {
				return res.status(401).send({error: "wrong email or password"});
			}
			user.comparePassword(req.body.password, (err2, isMatch) => {
				if (!isMatch) {
					return res.status(401).send({error: "wrong email or password"});
				}

				let payload = {
					sub: user._id,
					iat: moment().unix(),
					exp: moment().add(14, "days").unix()
				};

				let token = jwt.encode(payload, cfg.secret);
				return res.status(200).send({token: token});
			});
		});
	}
}