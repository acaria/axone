import {bindable, customElement} from "aurelia-templating";

@customElement('carousel')
export class Carousel {
	@bindable cid:string = "carousel-container";
	@bindable items = [];  
}