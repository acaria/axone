export interface Item {
	_id: string;
	name: string;
	__dendrites: Array<{_id: string, name: string}>;
	__neuron: string | null;
};

export interface INameID {
	_id: string | null,
	name: string
};

export interface Neuron {
	_id: string;

	cell: {
		"_id": string;
		"name": string;
	};

	axone: {
		"_id": string;
	} | null;

	dendrites: Array<string> | null;
}
