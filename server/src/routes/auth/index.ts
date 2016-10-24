/// <reference path="../../_all.d.ts" />
"use strict";

import express = require("express");
import { UserRepository } from "../../models/user";
import Account from "./account";
import Utils from "../utils";

var  debug = require("debug")("ax-server:auth");

let router = express.Router();
let users = new UserRepository();
let account = new Account(users);

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

router.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.status(404).send({error: "error"});
});

module.exports = router;