/// <reference path="../../_all.d.ts" />
"use strict";

import express = require("express");
var debug = require("debug")("ax-server:api");

let router = express.Router();

function parseRoute(router: express.Router, output: Array<Object>) {
	var route;
	router.stack.forEach(function(middleware: any) {
		if (middleware.route) {
			output.push(middleware.route);
		} else if (middleware.name === "router") {
			middleware.handle.stack.forEach(function(handler: any) {
				route = handler.route;
				if (route) {
					output.push(route);
				}
			});
		}
	});
};

router.get("/", (req, res) => {
	try {
		let result = {};
		var routes = ["neurons", "cells"];
		for (let route of routes) {
			result[route] = [];
			parseRoute(require(`./${route}/index`), result[route]);
		}
		var neuronsRouter = require("./neurons/index");

		res.status(200).send(JSON.stringify(result, null, 2));
	} catch (e) {
		debug(e);
		res.status(400).send({"error": "error in your request"});
	}
});

router.use((req, res, next) => {
	res.status(404).send({error: "error"});
});

module.exports = router;