import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {DomainPage} from "../domain/domain";
import {HomePage} from "../home/home";
import {GlobalProvider} from "../../providers/global/global";
import {ForgotPassword} from "../forgot-password/forgot-password";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    styleUrls: ['assets/main.css'],
})
export class LoginPage {
    username = "raman@gmail.com";
    password = "secret";
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, public navCtrl: NavController, public global: GlobalProvider, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public platform: Platform) {
        platform.registerBackButtonAction(() => {
            this.navCtrl.setRoot(DomainPage, {}, {animate: true, direction: "forward"});
        }, 1);
    }

    back() {
        this.navCtrl.setRoot(DomainPage, {}, {animate: true, direction: "forward"});
    }

    async login() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this.LocalStorage.get('domain').then((domain) => {
            var link = domain + '/api/login?email=' + this.username + '&password=' + this.password;
            var myData = "";
            this.http.post(link, myData)
                .subscribe(data => {
                    var user_data = data.json().user;
                    this.LocalStorage.set('user', user_data);

                    this.global.user_name = user_data.name;
                    this.global.user_email = user_data.email;
                    this.global.is_logged_in = true;
                    loading.dismiss();
                    this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: "forward"});
                }, error => {
                    loading.dismiss();

                    if (error.status == 401) {
                        var message = "Invalid Credentials";
                    } else {
                        var message = "Invalid Domain";
                    }

                    this.global.showToast(message, 3000, 'bottom');
                });
        });

    }

    forgotPassword() {
        this.navCtrl.setRoot(ForgotPassword, {}, {animate: true, direction: "forward"});
    }
}
