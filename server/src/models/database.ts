import * as mongoose from "mongoose";

import * as Promise from "bluebird";
(mongoose as any).Promise = Promise;

var debug = require("debug")("ax-server:database");

import "./schema/cell";
import "./schema/neuron";
import "./schema/user";

export default class {
	static connect(cfg: any) {
		let cnx = `${cfg.mongo.uri}:${cfg.port.mongo}/${cfg.mongo.db}`;
		debug(`connecting DB to ${cnx}...`);

		mongoose.set("debug", cfg.mongo.debug);

		return mongoose.connect(cnx)
		.then(() => debug("connected."));
	}
}