/// <reference path="_all.d.ts" />
"use strict";

import path = require("path");
import mongoose = require("mongoose");

var debug = require("debug")("ax-server:database");
var cfg = require("../config.js");

require("./models/schema/cell");
require("./models/schema/neuron");
require("./models/schema/user");

export default class {
	static connect() {
		let cnx = `${cfg.mongo.uri}:${cfg.port.mongo}/${cfg.mongo.db}`;
		debug(`connecting DB to ${cnx}...`);
		mongoose.Promise = global.Promise;
		mongoose.set("debug", cfg.mongo.debug);

		return mongoose.connect(cnx)
		.then(() => debug("connected."));
	}
}