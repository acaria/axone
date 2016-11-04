/// <reference path="../../../_all.d.ts" />
"use strict";

import express = require("express");
import { CellRepository } from "../../../models/cell";
import { NeuronRepository } from "../../../models/neuron";
import Utils from "../../utils";
import * as _ from "lodash";

var debug = require("debug")("ax-server:apiCells");
var cfg = require("../../../../config.js");
let router = express.Router();
let neurons = new NeuronRepository();
let cells = new CellRepository();

function debugRepositoryError(err: any) {
	if (!err) {
		return;
	}
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
		let selector = {
			user: req[cfg.tokenRef] as string,
			axone: req.query.axone,
		};

		if (req.query.cell) {
			selector = _.extend({cell: req.query.cell}, selector);
		}

		let query = neurons.model.find(selector)
		.populate("axone cell").exec()
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

		let selector = _.pick(req.body, ["axone", "user", "cell"]);
		neurons.upsert(selector, req.body, (error, isNew, result) => {
			if (error || !result) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			return res.status(isNew ? 201 : 200).send(result);
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
		let selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		neurons.model.findOne(selector).populate("cell axone dendrites").exec()
		.then(result => {
			if (!result) {
				return res.status(400).send({error: "error"});
			}
			res.status(200).send(result);
		})
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
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		let selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};
		neurons.update(selector, req.body, (error, result) => {
			if (error || !result) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
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
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		let selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		neurons.delete(selector, (error, result) => {
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