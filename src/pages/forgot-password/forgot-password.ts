import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController} from "ionic-angular";
import {Http} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {DomainPage} from "../domain/domain";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'forgot-password.html',
    styleUrls: ['assets/main.css'],
})
export class ForgotPassword {
    email = "";
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController) {
        this.LocalStorage.clear();
    }

    forgotPassword() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        if (this.global.domain) {
            var link = this.global.domain + '/password/email?email=' + this.email;
            var myData = "";
            this.http.post(link, myData)
                .subscribe(data => {
                    loading.dismiss();
                    this.Toast.create({
                        message: 'Password reset email sent',
                        duration: 3000,
                        position: 'bottom'
                    }).present();
                }, error => {
                    loading.dismiss();
                    this.Toast.create({
                        message: 'Password reset email sent',
                        duration: 3000,
                        position: 'bottom'
                    }).present();
                });
        } else {
            loading.dismiss();
            this.navCtrl.setRoot(DomainPage, {}, {animate: true, direction: "forward"});
            this.Toast.create({
                message: 'Please enter domain first!',
                duration: 3000,
                position: 'bottom'
            }).present();
        }

    }
}
