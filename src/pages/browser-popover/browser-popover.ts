import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
	selector: 'page-browser-popover',
	templateUrl: 'browser-popover.html',
})
export class BrowserPopoverPage {

	parentCallback: {
		refresh: () => void,
		close: () => void
	};

	constructor(public viewCtrl: ViewController, private navParams: NavParams) {
		this.parentCallback = this.navParams.data.callback;
	}

	refresh() {
		this.parentCallback.refresh();
		this.viewCtrl.dismiss();
	}

	close() {
		this.viewCtrl.dismiss();
		this.parentCallback.close();
	}
}
