export class HomeItem {

	tpl = "home-item";

	constructor(private title:string, private description, private img:string) {}

	activate(model) {
		this.title = model.title;
		this.tpl = model.tpl;
		this.img = model.img;
		this.description = model.description;
	}
}