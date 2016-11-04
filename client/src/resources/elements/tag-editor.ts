import * as $ from 'jquery';
import {bindable} from 'aurelia-framework';
import 'magicsuggest';
import {log} from '../../logger';

export class TagEditor {
	@bindable content: Array<Object> = [];
	@bindable selection: Array<Object> = [];
	private tagInput:Element;
	private el:MagicSuggest.Instance;

	attached() {
		var myThis = this;
		this.el = $(this.tagInput).magicSuggest({
			displayField: "name",
			placeholder: "Tags",
			data: this.content,
			value: this.selection,
			selectionRenderer: function(data){
    			let result = data.name;
    			if (data.id)
    				result = `<span style="color:red">${result}</span>`;
    			return result;
  			}
		});

		$(this.el).on('selectionchange', function(){
			while(myThis.selection.length > 0) {
    			myThis.selection.pop();
			}
			for(let item of this.getSelection()) {
				if (item.id) {
					myThis.selection.push({
						_id: null,
						name: item.name
					});
				} else {
					myThis.selection.push(item);
				}
			}
		});
	}

	contentValueChanged(value) {
		this.el.setData(value);
	}
}