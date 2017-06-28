import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";
import { HomePage } from '../home/home';

@IonicPage()
@Component({
	selector: 'page-browser',
	templateUrl: 'browser.html',
})
export class BrowserPage {

	browser = {

		title: '加载中',
		url: '',

		securityUrl: null,

		isLoaded: false,
		progressElement: null,
		progress: 0,
	};

	constructor(
		public navCtrl: NavController,
		private params: NavParams,
		private sanitizer: DomSanitizer,
		private popoverCtrl: PopoverController) {

		let browserConfig = this.params.get('browserConfig');

		if (browserConfig) {
			this.browser.title = browserConfig.title;
			this.browser.url = browserConfig.url;
			this.browser.securityUrl = this.sanitizer.bypassSecurityTrustResourceUrl(browserConfig.url);
		}
		else {
			this.browser.securityUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
		}
	}

	ionViewDidLoad() {
		this.browser.progressElement = document.getElementById('progress');
		this.load();
	}

	// 生成随机数
	private random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	private load() {

		let timeout = this.random(10, 30);

		let timer = setTimeout(() => {

			if (this.browser.isLoaded) {
				this.browser.progressElement.style.width = '100%';
				clearTimeout(timer);
				return;
			}

			this.browser.progress += this.random(1, 5);

			if (this.browser.progress > 90) {
				this.browser.progress = 90;
			}

			this.browser.progressElement.style.width = this.browser.progress + '%';

			this.load();

		}, timeout);
	}

	loadCompleted() {
		this.browser.isLoaded = true;
	}

	reload() {

		let title = this.browser.title;
		let url = this.browser.securityUrl;

		this.browser.title = '加载中';
		this.browser.securityUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

		setTimeout(() => {

			this.browser.isLoaded = false;
			this.browser.progress = 0;

			this.load();
			this.browser.title = title;
			this.browser.securityUrl = url;

		}, 10);
	}

	presentPopover(event) {

		let callback = {

			refresh: () => {
				this.reload();
			},
			close: () => {

				if (this.navCtrl.length() < 2) {
					this.navCtrl.setRoot(HomePage);
				}
				else {
					this.navCtrl.pop();	
				}
			}
		};

		let popover = this.popoverCtrl.create(
			'BrowserPopoverPage',
			{ callback: callback }
		);

		popover.present({ ev: event });
	}
}

