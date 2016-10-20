export class ObjectKeysValueConverter {
	toView(obj) {
		let temp = [];
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

