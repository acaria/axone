import {log} from '../logger';
import {computedFrom} from 'aurelia-framework';
import {HomeItem} from '../views/home-item';
import {HomeItemAlt} from '../views/home-item-alt';

export class Home {
	title = 'Axone';
	subtitle = 'Feed your knowledge';
	catchPhrase = 'Feed your knowledge';

	carouselItems = [
		new HomeItem(
			"Organizing",
			"Strengthen your memory and prepare yourself to learn new topics by associating subjects to distinct categories",
		 	"brain.jpg"),
		new HomeItemAlt(
			"Mind mapping",
			"Put structure to information and better analyze, recall, and generate new ideas through visual techniques such as structured diagrams and customized pictograms", 
			"neuron.jpg"),
		new HomeItem(
			"Adapting Your Experience",
			"Get control over your own learning process by researching and consolidating information from multiple sources",
		 	"brain.jpg"),
		new HomeItemAlt(
			"Social Networking",
			"Share your ideas and learn from others while keeping track of your own mind mapping", 
			"neuron2.jpg")
	];
}
