import express = require("express");
var debug = require("debug")("ax-server:index");
var cfg = require("../../config");

let router = express.Router();

router.get("/", (req, res) => {
	try {
		res.render("stats", cfg);
	} catch (e) {
		debug(e);
		res.status(400).send({"error": "error in your request"});
	}
});

router.use((req, res, next) => {
	res.status(404).send({error: "error"});
});

export { router as RootRoute };