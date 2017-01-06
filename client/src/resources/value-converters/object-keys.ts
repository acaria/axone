export class ObjectKeysValueConverter {
	toView(obj) {
		let temp:Object[] = [];
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				temp.push(obj[prop]);
			}
		}
		return temp;
	}

	fromView(obj) {

	}
}

