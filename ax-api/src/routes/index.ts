/// <reference path="../_all.d.ts" />
"use strict";

import express = require("express");

let index = express.Router();

index.get("/", (req, res) => {
	res.render("home");
});

export = index;