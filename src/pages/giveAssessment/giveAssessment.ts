import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {GlobalProvider} from "../../providers/global/global";
import {takeAssessment} from "../takeAssessment/takeAssessment";

@Component({
    selector: 'page-login',
    templateUrl: 'giveAssessment.html',
    styleUrls: ['assets/main.css'],
})
export class giveAssessment {
    domain = "";
    assessments = [];
    assessment = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, private app: App, public global: GlobalProvider, public platform: Platform, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        platform.registerBackButtonAction(() => {
            this.app.getRootNav().pop(giveAssessment);
        }, 1);
    }

    public cancelAssessment() {
        this.app.getRootNav().pop(giveAssessment);
    }

    public attemptAssessment(assessment_id, training_id) {
        this.app.getRootNav().push(takeAssessment);
    }
}
