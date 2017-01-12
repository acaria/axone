import { App } from "./app";
import * as Bluebird from "bluebird";
import Database from "./models/database";

var cfg = require("../config.js");
var express = require("express");

Bluebird.config({ warnings: false });

Database.connect(cfg)
.catch(error => {
	throw error;
});

new App(express(), cfg).run();