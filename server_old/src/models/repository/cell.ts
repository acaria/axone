/// <reference path="../../_all.d.ts" />
"use strict";

import { ICellModel, cellModel} from "../schema/cell";
import { RepositoryBase } from "./base";

var debug = require("debug")("ax-server:cell");

export class CellRepository extends RepositoryBase<ICellModel> {
	constructor() {
		super(cellModel);
	}

	update(selector: {_id: string, user: string}, item: ICellModel, callback: (err: any, res: ICellModel) => void) {
		this._model.findOneAndUpdate(selector, item, {new: true, runValidators: true}, callback);
	}

	delete(selector: {_id: string, user: string}, callback: (err: any, res: any) => void) {
		this._model.remove(selector, (err) => callback(err, null));
	}
}