/// <reference path="../_all.d.ts" />
"use strict";

var debug = require("debug")("ax-api:api");
import express = require("express");
let router = express.Router();

import { CellModel, CellRepository} from "./../models/cell";


let repo = new CellRepository();

router.get("/", (req, res) => {
	try {
		repo.find().exec((error, result) => {
			if (error) {
				res.send({"error": "internal error"});
			} else {
				res.send(result);
			}
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.post("/", (req, res) => {
	try {
		repo.create(req.body, (error, result) => {
			if (error) {
				res.send({"error": "internal error"});
			} else {
				res.send({"success": "success"});
			}
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.get("/:id", (req, res) => {
	try {
		repo.findById(req.params._id, (error, result) => {
			if (error) {
				res.send({"error": "internal error"});
			} else {
				res.send(result);
			}
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.put("/:id", (req, res) => {
	try {
		repo.update(req.params._id, req.body, (error, result) => {
			if (error) {
				res.send({"error": "internal error"});
			} else {
				res.send(result);
			}
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

router.delete("/:id", (req, res) => {
	try {
		repo.delete(req.params._id, (error, result) => {
			if (error) {
				res.send({"error": "internal error"});
			} else {
				res.send(result);
			}
		});
	} catch (e) {
		debug(e);
		res.send({"error": "error in your request"});
	}
});

/*router.get("*", (req, res) => {
	res.redirect("/");
});*/

export = router;