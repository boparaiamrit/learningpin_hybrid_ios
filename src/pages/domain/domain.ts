import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController} from "ionic-angular";
import {Http} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'domain.html',
    styleUrls: ['assets/main.css'],
})
export class DomainPage {
    domain = "";
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController) {
        this.LocalStorage.clear();
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
