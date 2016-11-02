/// <reference path="../../../_all.d.ts" />
"use strict";

import express = require("express");
import { CellRepository } from "../../../models/cell";
import { NeuronRepository } from "../../../models/neuron";
import Utils from "../../utils";

var debug = require("debug")("ax-server:apiCells");
var cfg = require("../../../../config.js");
let router = express.Router();
let neurons = new NeuronRepository();
let cells = new CellRepository();

function debugRepositoryError(err: any) {
	if (err && err.name === "ValidationError") {
		for (var field in err.errors) {
			if (err.errors.hasOwnProperty(field)) {
				debug(err.errors[field].message);
				break;
			}
		}
	} else {
		debug(err.message);
	}
}

router.use(Utils.ensureAuthenticated);

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

router.get("/", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		var userId = req[cfg.tokenRef];

		let query = neurons.model.find({user: userId});
		if (req.query.axone) {
			query = query.where("axone").equals(req.query.axone);
		} else {
			query = query.where("axone").equals(null);
		}

		query.populate("_id axone dendrites").exec()
		.then(result => res.status(200).send(result))
		.catch(error => {
			debugRepositoryError(error);
			return res.status(400).send({error: "error"});
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.post("/", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		req.body.user = req[cfg.tokenRef];
		neurons.create(req.body, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			return res.status(201).send(result);
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

router.get("/:id", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		var userId = req[cfg.tokenRef];

		neurons.model.findOne({user: userId, _id: req.params.id}).populate("_id axone dendrites").exec()
		.then(result => res.status(200).send(result))
		.catch(error => {
			debugRepositoryError(error);
			return res.status(400).send({error: "error"});
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error"});
	}
});

router.put("/:id", (req, res) => {
	try {
		if (req[cfg.tokenRef]) {
			req.body.user = req[cfg.tokenRef];
		}
		neurons.update(req.params.id, req.body, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			if (!result) {
				return res.status(401).send({error: "error"});
			}
			return res.status(200).send(result);
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

router.delete("/:id", (req, res) => {
	try {
		neurons.delete(req.params.id, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			return res.status(200).send({success: "success"});
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

module.exports = router;