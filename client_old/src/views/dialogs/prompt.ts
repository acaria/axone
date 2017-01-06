import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Prompt {
	answer = null;
	message: string;

   constructor(private ctrl: DialogController) {
      ctrl.settings.centerHorizontalOnly = true;
   }

   activate(message: string) {
      this.message = message;
   }
}