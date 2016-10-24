/// <reference path="../../_all.d.ts" />
"use strict";

import * as Express from "express";
var debug = require("debug")("ax-server:api");

let router = Express.Router();

router.get("/", (req: Express.Request, res) => {
	try {
		res.send({"commands": "api list"});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.status(404).send({error:"error"});
});

module.exports = router;