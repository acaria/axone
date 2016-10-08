/// <reference path="../_all.d.ts" />
"use strict";

import express = require("express");

let router = express.Router();

router.get("/", (req, res) => {
	res.render("home");
});

export = router;