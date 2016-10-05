/// <reference path="_all.d.ts" />
"use strict";

import express = require("express");
import bodyParser = require("body-parser");
import path = require("path");
import routeIndex = require("./routes/index");

export class AxApi {

  constructor(private app: express.Express, private port: Number) {
    //configure application
    this.configSetup(app);
    this.configMiddle(app);
    this.configRoutes(app);
  }

  private configSetup(app: express.Express) {
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");

    //mount json form parser
    app.use(bodyParser.json());

    //mount query string parser
    app.use(bodyParser.urlencoded({ extended: true }));

    //add static paths
    app.use(express.static(path.join(__dirname, "public")));

    // catch 404 and forward to error handler
    app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  }

  private configMiddle(app: express.Express) {
    //todo logger?
  }

  private configRoutes(app: express.Express) {
    app.use("/", routeIndex);
  }

  public run() {
    this.app.listen(this.port);
  }
}
