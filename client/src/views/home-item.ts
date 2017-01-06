export class HomeItem {
	tpl = "home-item";
	imgUrl;

	constructor(private title:string, private description, private img:string) {}

	activate(model) {
		this.title = model.title;
		this.tpl = model.tpl;
		this.imgUrl = `images/${model.img}`;
		this.description = model.description;
	}
}
