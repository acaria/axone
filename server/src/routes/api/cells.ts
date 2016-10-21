/// <reference path="../../_all.d.ts" />
"use strict";

import { NextFunction, Request, Response } from "express";
import express = require("express");
var debug = require("debug")("ax-server:routeApiCells");

import { RouteCtrl } from "./../route-ctrl";

import { CellRepository } from "../../models/cell";

let router = express.Router();
let cells = new CellRepository();

export class RouteApiCells extends RouteCtrl {

	private debugRepositoryError(err: any) {
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

	defRoute() {
		router.use((req, res, next) => {
			res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		router.get("/", (req, res) => {
			try {
				cells.find().exec((error, result) => {
					if (error) {
						this.debugRepositoryError(error);
						res.status(400).send({"error": "error"});
					} else {
						res.status(200).send(result);
					}
				});
			} catch (e) {
				debug(e);
				res.status(500).send({"error": "error"});
			}
		});

		router.post("/", (req, res) => {
			try {
				cells.create(req.body, (error, result) => {
					if (error) {
						this.debugRepositoryError(error);
						res.status(400).send({"error": "error"});
					} else {
						res.status(201).send(result);
					}
				});
			} catch (e) {
				debug(e);
				res.status(500).send({"error": "error in your request"});
			}
		});

		router.get("/:id", (req, res) => {
			try {
				cells.findById(req.params.id, (error, result) => {
					if (error) {
						this.debugRepositoryError(error);
						res.status(400).send({"error": "error"});
					} else {
						if (!result) {
							res.status(404).send({"error": "error"});
						} else {
							res.status(200).send(result);
						}
					}
				});
			} catch (e) {
				debug(e);
				res.status(500).send({"error": "error in your request"});
			}
		});

		router.put("/:id", (req, res) => {
			try {
				cells.update(req.params.id, req.body, (error, result) => {
					if (error) {
						this.debugRepositoryError(error);
						res.status(400).send({"error": "error"});
					} else {
						if (!result) {
							res.status(404).send({"error": "error"});
						} else {
							res.status(200).send(result);
						}
					}
				});
			} catch (e) {
				debug(e);
				res.status(500).send({"error": "error in your request"});
			}
		});

		router.delete("/:id", (req, res) => {
			try {
				cells.delete(req.params.id, (error, result) => {
					if (error) {
						this.debugRepositoryError(error);
						res.status(400).send({"error": "error"});
					} else {
						res.status(200).send({"success": "success"});
					}
				});
			} catch (e) {
				debug(e);
				res.status(500).send({"error": "error in your request"});
			}
		});

		return router;
	}
}

