import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'takeAssessment.html',
    styleUrls: ['assets/main.css'],
})
export class takeAssessment {
    domain = "";
    assessment = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, private app: App, public global: GlobalProvider, public platform: Platform, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    console.log(global.assessment);
    console.log(global.assessment.questions);
        platform.registerBackButtonAction(() => {
            // this.app.getRootNav().pop(giveAssessment);
        }, 1);
    }

}
