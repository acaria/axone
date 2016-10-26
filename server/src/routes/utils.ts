/// <reference path="../_all.d.ts" />
"use strict";

import express = require("express");
import jwt = require("jwt-simple");
import moment = require("moment");

var debug = require("debug")("ax-server:utils");
var cfg = require("../../config.js");

export default class {
	static ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
		let authKey = "authorization";

		if (!req.headers[authKey]) {
			return res.status(401).send({error: "Authorized access only"});
		}

		var token = req.headers[authKey].split(" ")[1];
		var payload = null;
		try {
			payload = jwt.decode(token, cfg.secret);
		} catch (err) {
			return res.status(401).send({error: err.message});
		}

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({error: "Expired token"});
		}
		req[cfg.tokenRef] = payload.sub;
		next();
	}
}