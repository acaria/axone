import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Confirm {
	message: string;
	option: string;
	check: boolean;

   constructor(private ctrl: DialogController) {
      ctrl.settings.centerHorizontalOnly = true;
   }

   activate(data:{message: string, option:string, precheck?:boolean}) {
      this.message = data.message;
      this.option = data.option;
      this.check = data.precheck;
   }
}