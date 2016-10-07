/// <reference path="../_all.d.ts" />
"use strict";

import express = require("express");
//import mongoose = require("mongoose");
let index = express.Router();
//import cell = require ("../models/cell");

index.get("/", (req, res) => {
	//cell.find(function (err, todos))
	res.render("home");
});

export = index;