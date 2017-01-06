export class HomeItemAlt {

	tpl = "home-item-alt";

	imgUrl: string;

	constructor(private title:string, private description, private img:string) {}

	activate(model) {
		this.title = model.title;
		this.tpl = model.tpl;
		this.imgUrl = `images/${model.img}`;
		this.description = model.description;
	}
}
