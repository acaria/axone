/// <reference path="../../../_all.d.ts" />
"use strict";

import express = require("express");
import { CellRepository, ICellModel } from "../../../models/cell";
import { NeuronRepository } from "../../../models/neuron";
import Utils from "../../utils";
import * as _ from "lodash";

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
		if (err) {
			debug(err.message);
		} else {
			debug("unexpected error");
		}
	}
}

router.use(Utils.ensureAuthenticated);

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

function batchUpdateOrCreate(req: any, res: any, callback: (error: any, isNew: boolean, result: ICellModel) => void) {
	if (!req[cfg.tokenRef]) {
		return res.status(401).send({error: "token error"});
	}

	if (!req.body.cell) {
		return res.status(400).send({error: "cell field missing"});
	}
	req.body.cell.user = req[cfg.tokenRef];

	if (req.body.cell._id) {
		let selector = {
			_id: req.body.cell._id as string,
			user: req[cfg.tokenRef] as string
		};
		cells.update(selector, req.body.cell, (error, result) => {
			callback(error, false, result);
		});
	} else {
		let cellSelect = _.pick(req.body.cell, ["name", "user"]);
		cells.upsert(cellSelect, req.body.cell, callback);
	}
}

router.post("/", (req, res) => {
	try {
		batchUpdateOrCreate(req, res, (error, isNew, result) => {
			if (error || !result) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}

			if (req.body.neuron) {
				req.body.neuron.user = result.user;
				req.body.neuron.cell = result._id;

				let neuronSelect = _.pick(req.body.neuron, ["cell", "user", "axone"]);
				neurons.upsert(neuronSelect, req.body.neuron, (error2, isNew2, result2) => {
					if (error2) {
						debugRepositoryError(error2);
						return res.status(400).send({error: "error"});
					}
					return res.status(isNew ? 201 : 200).send({
						cell: result,
						neuron: result2
					});
				});
			}
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
		var selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		cells.delete(selector, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "cell error"});
			}
			let neuronSelect = {
				cell: req.params.id as string,
				user: req[cfg.tokenRef] as string
			};
			neurons.model.remove(neuronSelect).exec()
			.then(result => {
				return res.status(200).send({success: "success"});
			})
			.catch(error => {
				debugRepositoryError(error);
				return res.status(400).send({error: "neuron error"});
			});
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

module.exports = router;