/// <reference path="../../_all.d.ts" />
"use strict";

import express = require("express");
var debug = require("debug")("ax-server:routes");
let router = require("express").Router();
import { RouteCtrl } from "./../route-ctrl";

import { CellRepository } from "../../models/cell";

let cells = new CellRepository();

export class RouteApiCells extends RouteCtrl {
	defRoute() {
		router.get("/", (req, res) => {
			try {
				cells.find().exec((error, result) => {
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
				cells.create(req.body, (error, result) => {
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
				cells.findById(req.params.id, (error, result) => {
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
				cells.update(req.params.id, req.body, (error, result) => {
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
				cells.delete(req.params.id, (error, result) => {
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

		return router;
	}
}

