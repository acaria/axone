import * as $ from 'jquery';
import * as _ from "lodash";
import "./magicsuggest/magicsuggest";

import {bindable} from "aurelia-framework";
import {INameID} from "../../models/neuron-item";
import {log} from "../../logger";

export class TagEditor {
	@bindable content: Array<INameID> = [];
	@bindable selection: Array<INameID> = [];
	private tagInput:Element;
	private el:MagicSuggest.Instance;

	isAttached = false;

	attached() {
		if (this.isAttached) {
			return;
		}
		this.isAttached = true;

		var myThis = this;
		this.el = $(this.tagInput).magicSuggest({
			displayField: "name",
			placeholder: "Tags",
			data: this.content,
			value: this.selection,
			valueField: "_id",
			selectionRenderer: function(data){
    			let result = data.name;
    			if (!_.find(myThis.content, {"name": data.name})) {
    				result = `<span style="color:red">${result}</span>`;
    			} else {
    				result = `<span>${result}</span>`;
    			} 
    			return result;
  			}
		});

		$(this.el).on('selectionchange', function(){
			while(myThis.selection.length > 0) {
    			myThis.selection.pop();
			}
			for(let item of this.getSelection()) {
				if (item._id == item.name) {
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

	contentChanged(value) {
		if (this.el) {
			this.el.setData(value);
		}
	}

	selectionChanged(value) {
		if (this.el) {
			this.el.clear(true);
			this.el.setSelection(value);
		}
	}
}
