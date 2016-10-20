/// <reference path="../_all.d.ts" />
"use strict";

import express = require("express");

let router = express.Router();
export class RouteCtrl {
	protected app: express.Express;
	public root: string;
	protected subs: Array<RouteCtrl> = [];

	setup(app: express.Express, root: string) {
		this.app = app;
		this.root = root;
	}

	protected defRoute() {
		return null;
	}

	addSub(ctrl: RouteCtrl) {
		ctrl.root = this.root + ctrl.root;
		this.subs.push(ctrl);

		return this;
	}

	process() {
		let router = this.defRoute();
		if (router != null) {
			this.app.use(this.root, router);
		}

		for (let subRouter of this.subs) {
			subRouter.process();
		}
	}
}

export function CRoute<r extends RouteCtrl>(
	rrr: { new(): r; }, app: express.Express, root: string): r {

	var newRoute: r;
	newRoute = new rrr();

   newRoute.setup(app, root);
   return newRoute;
}