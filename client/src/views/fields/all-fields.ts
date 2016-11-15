import {Description} from "./description";
import {Picture} from "./picture";
import {Date} from "./date";
import {Identity} from "./identity";
import {IField} from "./base/field";

export var fieldList = new Array<IField>(
	new Identity(),
	new Description(),
	new Picture(),
	new Date()
);