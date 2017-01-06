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
