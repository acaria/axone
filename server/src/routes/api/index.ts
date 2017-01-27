import express = require("express");
var debug = require("debug")("axone:api");

let router = express.Router();

router.get("/", (req, res) => {
	try {
		res.status(200).send("empty");
	} catch (e) {
		debug(e);
		res.status(400).send({"error": "error in your request"});
	}
});

router.use((req, res, next) => {
	res.status(404).send({error: "error"});
});

export { router as ApiRoute };