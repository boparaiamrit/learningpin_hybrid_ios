import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {DomainPage} from "../domain/domain";
import {GlobalProvider} from "../../providers/global/global";
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-login',
    templateUrl: 'logout.html',
    styleUrls: ['assets/main.css'],
})
export class LogoutPage {
    username = "";
    password = "";
    error: boolean = false;

    constructor(public global: GlobalProvider, private afAuth: AngularFireAuth, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public platform: Platform) {
        this.logout();
    }

    async logout() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.LocalStorage.remove('user');
        this.LocalStorage.remove('token');
        loading.dismiss();
        this.global.is_domain_present = true;
        this.navCtrl.setRoot(LoginPage, {}, {animate: false, direction: "forward"});
    }

    public AuthFail() {
        this.global.is_logged_in = false;
        this.LocalStorage.remove('user');
        this.LocalStorage.remove('token');
        this.global.showToast("Please login to proceed!", 2000, 'bottom');
        this.navCtrl.setRoot(DomainPage, {}, {animate: true, direction: "forward"});
    }
}
