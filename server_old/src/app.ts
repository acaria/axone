/// <reference path="_all.d.ts" />
"use strict";

import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import methodOverride = require("method-override");
import path = require("path");
import morgan = require("morgan");
import database from "./database";
import fs = require("fs");

var debug = require("debug")("ax-server:express");
var requireDir = require("require-dir");
var favicon = require("serve-favicon");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "../logs/access.log"), {flags: "a"});
var cfg = require("../config.js");

export default class {

	constructor(private app: express.Express, private port: Number) {
        database.connect()
        .catch(error => {
            throw error;
        });

        try {
            this.configSetup(app);
            this.configMiddle(app);
            this.configRoutes(app);
            this.errorHandling(app);
        } catch (error) {
            throw error;
        }
    }

    private configSetup(app: express.Express) {
        for (let dir of ["storage", cfg.storage.avatar, cfg.storage.picture]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }

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

        //add static paths
        app.use(express.static(path.join(__dirname, "../storage")));
        app.use(express.static(path.join(__dirname, "../../client/dist")));
    }

    private configMiddle(app: express.Express) {
    	app.use(favicon(path.join(__dirname, "../public/favicon.ico")));
    	app.use(morgan("dev"));
        app.use(morgan("combined", {stream: accessLogStream}));
    }

    private configRoutes(app: express.Express) {
    	app.use("/api/cells", require("./routes/api/cells"));
        app.use("/api/neurons", require("./routes/api/neurons"));
        app.use("/api/items", require("./routes/api/items"));
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