/// <reference path="../../_all.d.ts" />
"use strict";

import express = require("express");
var debug = require("debug")("ax-server:api");

let router = express.Router();

router.get("/", (req: Express.Request, res) => {
	try {
		res.send({"commands": "api list"});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.use((req, res, next) => {
	res.status(404).send({error: "error"});
});

module.exports = router;