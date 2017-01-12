import { Request, Response, NextFunction} from "express";
import jwt = require("jwt-simple");
import moment = require("moment");

//var debug = require("debug")("ax-server:utils");
var cfg = require("../../config.js");

export default class {
	static ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
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
		(req as any)[cfg.tokenRef] = payload.sub;
		next();
	}

	static getToken(req: Request): string | null {
		return (req as any)[cfg.tokenRef];
	}
}