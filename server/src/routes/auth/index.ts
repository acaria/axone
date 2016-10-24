/// <reference path="../../_all.d.ts" />
"use strict";

import express = require("express");
import { UserRepository } from "../../models/user";
import { Register } from "./register";

var  debug = require("debug")("ax-server:auth");

let router = express.Router();
let users = new UserRepository();
let register = new Register(users);

router.post("/signup", (req, res) => {
	try {
		return register.signup(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.post("/login", (req, res) => {
	try {
		return register.login(req, res);
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.status(404).send({error: "error"});
});

module.exports = router;