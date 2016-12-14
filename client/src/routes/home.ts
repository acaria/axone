import {log} from '../logger';
import {computedFrom} from 'aurelia-framework';
import {HomeItem} from '../views/home-item';
import {HomeItemAlt} from '../views/home-item-alt';

export class Home {
	title = 'Axone';
	subtitle = 'Feed yourself of your own knowledge';
	catchPhrase = 'Feed yourself of your own knowledge';

	carouselItems = [
		new HomeItem(
			"Planning tool",
			"Organizing your thoughts on what needs to be strengthened is a powerful way to prepare yourself to learn new topics",
		 	"brain.jpg"),
		new HomeItemAlt(
			"Mind mapping",
			"Using visual techniques such as structured diagrams or customised pictograms help structuring information, helping you to better analyse, recall and generate new ideas", 
			"neuron.jpg"),
		new HomeItem(
			"Adapted experience",
			"Feel the control over your own learning process, researching and consolidating information from multiple sources",
		 	"brain.jpg"),
		new HomeItemAlt(
			"Social network",
			"Share your ideas, learning from others while keeping your own mind mapping", 
			"neuron2.jpg")
	];
}