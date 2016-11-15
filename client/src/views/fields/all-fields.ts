import {Description} from "./description";
import {Picture} from "./picture";
import {Identity} from "./identity";
import {IField} from "./base/field";

export var fieldList = new Array<IField>(
	new Identity(),
	new Description(),
	new Picture()
);