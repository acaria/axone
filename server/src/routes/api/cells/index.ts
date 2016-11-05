/// <reference path="../../../_all.d.ts" />
"use strict";

import express = require("express");
import { CellRepository, ICellModel } from "../../../models/cell";
import { NeuronRepository } from "../../../models/neuron";
import Utils from "../../utils";
import * as _ from "lodash";

var debug = require("debug")("ax-server:apiCells");
var cfg = require("../../../../config.js");
var oid = require("mongoose").Types.ObjectId;

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

router.get("/", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		let selector = {
			user: req[cfg.tokenRef] as string
		};

		let query = cells.model.find(selector);
		if (req.query.sort) {
			query = query.sort(req.query.sort);
		}
		if (req.query.mode && req.query.mode === "nameids") {
			query = query.select("id name");
		}

		query.exec()
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

		var selector = _.pick(req.body, ["_id", "user"]);
		cells.upsert(selector, req.body, (error, isNew, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			if (!result) {
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
		cells.find(selector, null, null, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			if (!result) {
				return res.status(400).send({error: "error"});
			}
			return res.status(200).send(result);
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

router.put("/:id", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		var selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		cells.update(selector, req.body, (error, result) => {
			if (error) {
				debugRepositoryError(error);
				return res.status(400).send({error: "error"});
			}
			if (!result) {
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
		var selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		neurons.model.find({user: selector.user, cell: selector._id}).select("_id").exec()
		.then(ids => {
			let bulk = neurons.model.collection.initializeOrderedBulkOp();
			for (let id of _.map(ids, "_id")) {
				bulk.find({user: oid(selector.user), axone: oid(id)}).update({"$set": {axone: null}});
				bulk.find({user: oid(selector.user)}).update({"$pull": {dendrites: oid(id)}});
				bulk.find({_id: oid(id), user: oid(selector.user)}).delete();
			}
			bulk.execute()
			.then(results => {
				debug(results.getRawResponse());
				if (!results.ok) {
					return res.status(500).send({error: "error"});
				}
				cells.delete(selector, (error, result) => {
					if (error) {
						debugRepositoryError(error);
						return res.status(500).send({error: "error"});
					}
					return res.status(200).send({success: "success"});
				});
			})
			.catch(error => {
				debug(error);
				return res.status(500).send({error: "error"});
			});
		})
		.catch(error => {
			debug(error);
			return res.status(500).send({error: "error"});
		});
	} catch (e) {
		debug(e);
		return res.status(500).send({error: "error in your request"});
	}
});

module.exports = router;