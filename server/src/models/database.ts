import * as mongoose from "mongoose";

import * as Promise from "bluebird";
(mongoose as any).Promise = Promise;

var debug = require("debug")("ax-server:database");

import "./schema/cell";
import "./schema/neuron";
import "./schema/user";

export default class {
	static connect(cfg: any) {
		let cnx = "";
		let options = {
			auto_reconnect: true,
			server: { socketOptions: { keepAlive: 1000, connectTimeoutMS: 30000 } },
			replset: { socketOptions: { keepAlive: 1000, connectTimeoutMS : 30000 } }
		};

		if (cfg.mongo.user !== "") {
			(options as any).user = cfg.mongo.user;
			(options as any).pass = cfg.mongo.pass;
			(options as any).auth = { authdb: "admin" };
		}

		cnx = `${cfg.mongo.uri}:${cfg.port.mongo}/${cfg.mongo.db}`;

		debug(`connecting DB to ${cnx}...`);

		mongoose.set("debug", cfg.mongo.debug);

		return mongoose.connect(cnx, options)
		.then(() => debug("connected."));
	}
}