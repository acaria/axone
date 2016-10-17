/// <reference path="../_all.d.ts" />
"use strict";

import { CellModel, CellRepository} from "./../models/cell";

var debug = require("debug")("ax-server:routes");
let router = require("express").Router();
let repo = new CellRepository();

router.get("/", (req, res) => {
	try {
		repo.find().exec((err, cells) => {
			res.render(
				"home",
				{ cells: cells });
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

export = router;