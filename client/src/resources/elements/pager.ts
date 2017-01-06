import {bindingMode}  from 'aurelia-binding';
import {bindable, customElement} from 'aurelia-templating';

@customElement('pager')
export class Pager {
	@bindable({defaultBindingMode: bindingMode.twoWay})

	@bindable page          = 1;  // current page
	@bindable pagerange     = 3;  // ranges of pages to view e.g "3 4 [5] 6 7"
	@bindable limit         = 30; // the amount of records on a page
	@bindable nbitems;            // items list
	@bindable pages;              // total amount of pages

	private navs:Object[] = [];

	attached() {
		if (!this.page) {
			this.page = 1;
		}

		this.reloadCount();
	}

	pageChanged(newValue, oldValue) {
		if (newValue !== oldValue) {
			this.goToPage(newValue);
		}
	}

	nbitemsChanged(newValue, oldValue) {
		this.reloadCount();
	}

	nextPage() {
		if (this.page < this.pages) {
			this.page++;
		}
	}

	prevPage() {
		if (this.page > 1 && this.page <= this.pages) {
			this.page--;
		}
	}

	lastPage() {
		this.page = this.pages;
	}

	firstPage() {
		this.page = 1;
	}

	goToPage(page) {
		if (page < 0 || page > this.pages) {
			return;
		}

		this.calculateRange();
	}

	private reloadCount() {
		this.calculatePages();
		this.calculateRange();
	}

	private calculateRange() {
		let rangeStart = Math.max(this.page - this.pagerange, 1);
		let rangeEnd   = Math.min(this.page + this.pagerange, this.pages);
		let navs:Object[]       = [];
		let i;

		if (this.page <= this.pagerange) {
			rangeEnd = Math.min(this.pagerange * 2 + 1, this.pages);
		}

		if (this.page > (this.pages - this.pagerange)) {
			if (this.pages <= (this.pagerange * 2)) {
				rangeStart = 1;
			} else {
				rangeStart = Math.max(this.pages - this.pagerange * 2, this.pagerange);
			}
		}

		for (i = rangeStart; i < rangeEnd + 1; i++) {
			navs.push({
				text: i.toString(),
				current: i === this.page,
				load: page => {
					this.page = parseInt(page, 10);
				}
			});
		}

		this.navs = navs;
	}

	private calculatePages() {
		this.pages = Math.ceil(this.nbitems / this.limit) || 1;
		return this.goToPage(1);
	}
}
