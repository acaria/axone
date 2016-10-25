import {computedFrom} from 'aurelia-framework';


export class Welcome {
	title = 'Welcome !!!!';
	firstName = 'John';
	lastName = 'Doe';
	previousValue = this.fullName;

	@computedFrom('firstName', 'lastName')
	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	submit() {
		this.previousValue = this.fullName;
		alert(`Welcome, ${this.fullName}!`);
	}

	canDeactivate() {
		if (this.fullName !== this.previousValue) {
			return confirm('Are you sure you want to leave?');
		}
	}
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}