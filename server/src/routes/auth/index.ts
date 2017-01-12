import * as express from "express";
import { UserRepository } from "../../models/repository/user";
import Account from "./account";
import Utils from "../utils";
import path = require("path");
import mime = require("mime");
import fs = require("fs");
import multer = require("multer");

var debug = require("debug")("ax-server:auth");
var cfg = require("../../../config");

let router = express.Router();
let users = new UserRepository();
let account = new Account(users);
let uploads = multer({dest: cfg.storage.uploads});

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, dataType");
	next();
});

router.post("/signup", (req, res) => {
	try {
		return account.signup(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.post("/login", (req, res) => {
	try {
		return account.login(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.use(Utils.ensureAuthenticated);

router.get("/me", (req, res) => {
	try {
		return account.get(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.put("/me", (req, res) => {
	try {
		return account.update(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.post("/avatar", uploads.single("file"), (req, res) => {
	try {
		let fileName = req.file.filename + "." + mime.extension(req.file.mimetype);
		fs.rename(
			path.join(req.file.destination, req.file.filename),
			path.join(cfg.storage.avatar, fileName),
			function(error: any) {
				if (error) {
					debug(error);
					return res.status(500).send({error: "error"});
				}
				req.body = { "avatar": fileName };
				return account.update(req, res);
			}
		);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.status(404).send({error: "error"});
});

export { router as AuthRoute };