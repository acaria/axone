/// <reference path="../../_all.d.ts" />
"use strict";

import { INeuronModel, neuronModel} from "../schema/neuron";
import { RepositoryBase } from "./base";

export class NeuronRepository extends RepositoryBase<INeuronModel> {
	constructor() {
		super(neuronModel);
	}

	update(selector: {_id: string, user: string}, item: INeuronModel, callback: (err: any, res: INeuronModel) => void) {
		this._model.findOneAndUpdate(selector, item, {new: true}, callback);
	}

	delete(selector: {_id: string, user: string}, callback: (err: any, res: any) => void) {
		this._model.remove(selector, (err) => callback(err, null));
	}
}