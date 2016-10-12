/// <reference path="_all.d.ts" />
"use strict";

//express
var debug = require("debug")("ax-api:express");
var favicon = require("serve-favicon");

import logger = require("morgan");
import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import methodOverride = require("method-override");
import path = require("path");


//data
import mongoose = require("mongoose");

//routes
import routeIndex = require("./routes/index");
import routeApi = require("./routes/api");

//config
import cfg = require("./config");
//------------------------------------------------------------
export class AxApi {

  constructor(private app: express.Express, private port: Number) {
    //init database
    mongoose.Promise = global.Promise;
    mongoose.connect(cfg.DB_CNX)
      .then(() => debug("cnx to " + cfg.DB_CNX))
      .catch((err) => debug(err.message));

    //configure application
    this.configSetup(app);
    this.configMiddle(app);
    this.configRoutes(app);
  }

  private logErrors(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    debug(err.stack);
    var error = new Error("Not Found");
    err.status = 404;
    next(err);
  }

  private configSetup(app: express.Express) {
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
    app.use(express.static(path.join(__dirname, "../public")));
  }

  private configMiddle(app: express.Express) {
    app.use(favicon(path.join(__dirname, "../public/favicon.ico")));
    app.use(this.logErrors);
    app.use(logger("dev"));
  }

  private configRoutes(app: express.Express) {
    app.use("/", routeIndex);
    app.use("/api", routeApi);
  }

  public run() {
    this.app.listen(this.port, () => {
      debug("App is running at localhost:" + this.port);
    });
  }
}
