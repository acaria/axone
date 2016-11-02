export class NameIndexValueConverter {
	toView(obj) {
		return {
			name: obj.name,
			id: obj._id
		};
	}

	fromView(obj) {
		return {
			_id: obj.id,
			name: obj.name
		};
	}
}

