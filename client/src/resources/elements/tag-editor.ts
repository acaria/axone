import * as $ from 'jquery';
import {bindable} from 'aurelia-framework';
import 'magicsuggest';

export interface IElement {
	name: string,
	id: string
}

export class TagEditor {
	@bindable content: Array<IElement> = [];
	private tagInput:Element;

	attached() {
		var myThis = this;
		var el = $(this.tagInput).magicSuggest({
			placeholder: "Please choose any cell",
			data: this.content
		});

		$(el).on('selectionchange', function(){
			while(myThis.content.length > 0) {
    			myThis.content.pop();
			}
			for(let selection of this.getSelection()) {
				myThis.content.push(selection);
			}
		});
	}
}