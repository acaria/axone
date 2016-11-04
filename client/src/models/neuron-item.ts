export interface Item {
	_id: string;
	name: string;
	__dendrites: Array<{_id: string, name: string}>;
	__neuron: string;
};