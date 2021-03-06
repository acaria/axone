/// <reference path="../../_all.d.ts" />
"use strict";

import { IUserModel, userModel} from "../schema/user";
import { RepositoryBase } from "./base";

export class UserRepository extends RepositoryBase<IUserModel> {
	constructor() {
		super(userModel);
	}
}