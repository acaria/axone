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

		if (Number(req.query.limit) && Number(req.query.page)) {
			query = query.skip(Number(req.query.limit) * (Number(req.query.page) - 1)).limit(Number(req.query.limit));
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

router.get("/count", (req, res) => {
	try {
		if (!req[cfg.tokenRef]) {
			return res.status(401).send({error: "token error"});
		}
		let selector = {
			user: req[cfg.tokenRef] as string
		};

		let query = cells.model.count(selector);

		query.exec()
		.then(count => res.status(200).send({success: "success", count: count}))
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

		var selector = _.pick(req.body, ["user"]);
		cells.create(req.body, (error, result) => {
			if (error || !result) {
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
		let selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};
		cells.findOne(selector, null, null, (error, result) => {
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
		var selector = {
			_id: req.params.id as string,
			user: req[cfg.tokenRef] as string
		};

		neurons.model.find({user: selector.user, cell: selector._id}).select("_id").exec()
		.then(ids => {
			return new Promise((resolve, reject) => {
				try {
					let bulk = neurons.model.collection.initializeOrderedBulkOp();
					for (let id of _.map(ids, "_id")) {
						bulk.find({user: oid(selector.user), axone: oid(id)}).update({"$set": {axone: null}});
						bulk.find({user: oid(selector.user)}).update({"$pull": {dendrites: oid(id)}});
						bulk.find({_id: oid(id), user: oid(selector.user)}).delete();
					}
					if (bulk.length === 0) {
						return resolve();
					}
					bulk.execute().then(results => {
						if (!results.ok) {
							return reject(new Error("error"));
						}
						return resolve();
					});
				} catch (err) {
					return reject(err);
				}
			}).then(() => {
				cells.delete(selector, (error, result) => {
					if (error) {
						throw error;
					}
					return res.status(200).send({success: "success"});
				});
			}).catch(error => {
				throw error;
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