export interface IEvent<TSender, TArgs> {
	sub(fn: (sender: TSender, args: TArgs) => void): void;
	unsub(fn: (sender: TSender, args: TArgs) => void): void;
}

export class EventDispatcher<TSender, TArgs> implements IEvent<TSender, TArgs> {

	private _subs: Array<(sender: TSender, args: TArgs) => void> = new Array<(sender: TSender, args: TArgs) => void>();

	sub(fn: (sender: TSender, args: TArgs) => void): void {
		if (fn) {
			this._subs.push(fn);
		}
	}

	unsub(fn: (sender: TSender, args: TArgs) => void): void {
		let i = this._subs.indexOf(fn);
		if (i > -1) {
			this._subs.splice(i, 1);
		}
	}

	dispatch(sender: TSender, args: TArgs): void {
		for (let handler of this._subs) {
			handler(sender, args);
		}
	}
}
