import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController} from "ionic-angular";
import {Headers, Http, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {GlobalProvider} from "../../providers/global/global";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-login',
    templateUrl: 'domain.html',
    styleUrls: ['assets/main.css'],
})
export class DomainPage {
    domain = "staging";
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController) {
        // this.global.is_logged_in_page = true;

        this.LocalStorage.get('domain').then((domain) => {
            if (domain) {
                this.global.is_domain_present = true;
                this.LocalStorage.get('token').then((token) => {
                    if (token) {
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        let headers = new Headers({'Authorization': 'Bearer ' + token});
                        var options = new RequestOptions({headers: headers});
                        loading.present();
                        var link = domain + '/api/refresh';
                        this.http.get(link, options).subscribe(data => {
                            this.LocalStorage.set('token', data.json().token);

                            this.global.user_name = data.json().name;
                            this.global.user_email = data.json().email;
                            this.global.is_logged_in = true;
                            this.global.token = data.json().token;
                            // this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: "forward"});
                            loading.dismiss();
                            this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: "forward"});
                        }, error => {
                            loading.dismiss();
                            this.LocalStorage.clear();
                        });
                    } else {
                        this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: "forward"});
                    }
                });
            }

        });
        // this.LocalStorage.clear();
    }

    async setDomain() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        var domain = 'https://' + this.domain + '.learningpin.com';
        this.LocalStorage.set('domain', domain);
        this.global.domain = domain;


        loading.dismiss();
        this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: "forward"});
    }
}
