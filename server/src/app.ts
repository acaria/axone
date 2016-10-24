/// <reference path="_all.d.ts" />
"use strict";

//express
var debug = require("debug")("ax-server:express");
var requireDir = require("require-dir");
var favicon = require("serve-favicon");

import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import methodOverride = require("method-override");
import path = require("path");

//log
var fs = require("fs");
var accessLogStream = fs.createWriteStream(path.join(__dirname, "../logs/access.log"), {flags: "a"});
import morgan = require("morgan");

//data
import mongoose = require("mongoose");

//config
var cfg = require("../config.js");
//------------------------------------------------------------
export default class {

	constructor(private app: express.Express, private port: Number) {
        let cnx = `${cfg.mongo.uri}:${cfg.port.mongo}/${cfg.mongo.db}`;
        mongoose.Promise = global.Promise;
        mongoose.connect(cnx)
        .then(() => debug(`cnx to ${cnx}`))
        .catch((err) => debug(err.message));

    	//configure application
    	this.configSetup(app);
    	this.configMiddle(app);
    	this.configRoutes(app);
    	this.errorHandling(app);
    }

    private configSetup(app: express.Express) {
    	app.disable("x-powered-by");

    	app.set("views", path.join(__dirname, "../views"));
    	app.set("view engine", "pug");

    	app.use(bodyParser.json());
    	app.use(bodyParser.urlencoded({ extended: true }));
    	app.use(cookieParser());

    	app.use(methodOverride("X-HTTP-Method"));
    	app.use(methodOverride("X-HTTP-Method-Override"));
    	app.use(methodOverride("X-Method-Override"));
    	app.use(methodOverride("_method"));

    	//add static path
    	//app.use(express.static(path.join(__dirname, "../public")));
    	//add client path
    	app.use(express.static(path.join(__dirname, "../../client/dist")));
    }

    private configMiddle(app: express.Express) {
    	app.use(favicon(path.join(__dirname, "../public/favicon.ico")));
    	app.use(morgan("dev"));
        app.use(morgan("combined", {stream: accessLogStream}));
    }

    private configRoutes(app: express.Express) {
    	app.use("/api/cells", require("./routes/api/cells"));
        app.use("/api", require("./routes/api"));
        app.use("/auth", require("./routes/auth"));
    }

    private errorHandling(app: express.Express) {
    	if (app.get("env") === "development") {
    		app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    			res.status(err.status || 500);
    			res.json({
    				error: err,
    				message: err.message
    			});
    		});
    	} else {
    		app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    			res.status(err.status || 500);
    			res.json({
    				error: {},
    				message: err.message
    			});
    		});
    	}

    	app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    		if ((app.get("env") === "development") && req.url.startsWith("/browser-sync/")) {
                next();
                return;
            }
            let err = new Error("Not Found");
    		next(err);
    	});
    }

    public run() {
    	this.app.listen(this.port, () => {
    		debug(`App is running at localhost:${this.port}`);
    	});
    }
}