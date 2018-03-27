import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {giveAssessment} from "../giveAssessment/giveAssessment";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'completed-assessments.html',
    styleUrls: ['assets/main.css'],
})
export class CompletedAssessments {
    domain = "";
    assessments = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, public global: GlobalProvider, private app: App, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.completedAssessments();
    }

    public completedAssessments() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.LocalStorage.get('domain').then((domain) => {
            loading.present();
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/assessments/complete';
                this.http.get(link, options).subscribe(data => {
                    // this.navCtrl.push(HomePage);
                    loading.dismiss();
                    this.assessments = data.json().assessments;
                    console.log(this.assessments);
                }, error => {
                    loading.dismiss();
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    public attemptAssessment(assessment_id, training_id) {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.global.assessment_id = assessment_id;

        this.global.training_id = training_id;
        loading.present();
        this.LocalStorage.get('domain').then((domain) => {
            loading.present();
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/assessments/' + assessment_id;
                this.http.get(link, options).subscribe(data => {
                    // this.navCtrl.push(HomePage);
                    loading.dismiss();
                    this.global.assessment = data.json().assessment;
                    // this.navCtrl.push(giveAssessment);
                    console.log(this.global.assessment);
                    this.app.getRootNav().push(giveAssessment);
                }, error => {
                    loading.dismiss();
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }
}
