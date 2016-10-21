/// <reference path="../_all.d.ts" />
"use strict";

import * as Express from "express";
import {RouteCtrl} from "./route-ctrl";
var debug = require("debug")("ax-server:routes");

let router = Express.Router();
export class RouteApi extends RouteCtrl {

	private extractCommands() {
		var commands = [];
		for (var sub of this.subs) {
			commands.push(sub.root);
		}
		return commands;
	}

	defRoute() {
		router.get("/", (req: Express.Request, res) => {
			try {
				res.send({"commands": this.extractCommands()});
			} catch (e) {
				debug(e);
				res.send({"error": "error in your request"});
			}
		});

		return router;
	}
}