import {Description} from "./description";
import {Identity} from "./identity";
import {IField} from "./base/field";

export var fieldList = new Array<IField>(
	new Identity(),
	new Description()
);