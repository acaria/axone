import * as mongoose from "mongoose";

import * as Promise from "bluebird";
(mongoose as any).Promise = Promise;

var debug = require("debug")("axone:database");

import "./schema/cell";
import "./schema/neuron";
import "./schema/user";

export default class {
	constructor(cfg: any) {
		this.cnx = `${cfg.mongo.uri}:${cfg.port.mongo}/${cfg.mongo.db}`;
		this.options = {
			server: { reconnectTries: Number.MAX_VALUE, socketOptions: { keepAlive: 1000, connectTimeoutMS: 30000 } },
			replset: { socketOptions: { keepAlive: 1000, connectTimeoutMS : 30000 } }
		};

		if (cfg.mongo.user !== "") {
			(this.options as any).user = cfg.mongo.user;
			(this.options as any).pass = cfg.mongo.pass;
			(this.options as any).auth = { authdb: "admin" };
		}

		mongoose.set("debug", cfg.mongo.debug);
	}

	private options: mongoose.ConnectionOptions;
	private cnx: string;

	connect() {
		mongoose.connection.on("connecting", () => debug(`connecting to ${this.cnx}...`));
		mongoose.connection.on("connected", () => debug("connected."));
		mongoose.connection.on("error", (err: any) => debug(err));
		mongoose.connection.on("disconnected", () => debug("disconnected."));

		return mongoose.connect(this.cnx, this.options)
		.catch((error) => debug(error));
	}
}