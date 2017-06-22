import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

declare var QQSDK: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	info = '<empty>';
	token = '';
	userId = '';

	constructor(public navCtrl: NavController, public http: Http) {
	}

	checkInstall() {

		let args = {
			client: QQSDK.ClientType.QQ // QQSDK.ClientType.QQ, QQSDK.ClientType.TIM;
		};

		QQSDK.checkClientInstalled(() => {

			this.info = 'client is installed';

		}, () => {

			// if installed QQ Client version is not supported sso,also will get this error
			this.info = 'client is not installed';

		}, args);
	}

	login() {

		let args = {
			client: QQSDK.ClientType.QQ // QQSDK.ClientType.QQ, QQSDK.ClientType.TIM;
		};

		QQSDK.ssoLogin(result => {

			this.token = result.access_token;
			this.userId = result.userid;

			this.info = 'token is ' + result.access_token + '\n';
			this.info += 'userid is ' + result.userid + '\n';
			this.info += 'expires_time is ' + new Date(parseInt(result.expires_time)) + '\n';
			this.info += 'timeStamp is ' + result.expires_time;

		}, failReason => {

			this.info = failReason;

		}, args);
	}

	logoff() {

		QQSDK.logout(() => {

			this.info = 'logout success';

		}, failReason => {

			this.info = failReason;
		});
	}

	getUserInfo() {

		const app_id = '1106243106';
		const api_url = 'https://graph.qq.com/user/get_user_info';

		this.http.get(

			`${api_url}?access_token=${this.token}&oauth_consumer_key=${app_id}&openid=${this.userId}`

		).subscribe(data => {

			this.info = data.json();

		}, err => {

			this.info = err
		});
	}
}
