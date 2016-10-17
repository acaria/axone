/// <reference path="../_all.d.ts" />
"use strict";

import {Request, Response, NextFunction} from "express";
var debug = require("debug")("ax-server:routes");
let router = require("express").Router();

import { CellModel, CellRepository} from "./../models/cell";


let repo = new CellRepository();

router.use(function(req: Request, res: Response, next: NextFunction) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

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
		repo.findById(req.params.id, (error, result) => {
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
		repo.update(req.params.id, req.body, (error, result) => {
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
		repo.delete(req.params.id, (error, result) => {
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