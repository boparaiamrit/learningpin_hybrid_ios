import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'page-login',
    templateUrl: 'approved-trainings.html',
    styleUrls: ['assets/main.css'],
})
export class ApprovedTrainings {
    domain = "";
    approved_trainings = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.approvedTrainings();
    }

    public approvedTrainings() {
        this.LocalStorage.get('domain').then((domain) => {

            this.LocalStorage.get('user').then((user) => {
            let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
            var options = new RequestOptions({headers: headers});
            var link = domain+'/api/trainings/approved';
            this.http.get(link, options).subscribe(data => {
                // this.navCtrl.push(HomePage);
                this.approved_trainings = data.json().approved_trainings;
            }, error => {
                this.Toast.create({
                    message: 'Please login to proceed!',
                    duration: 2000,
                    position: 'bottom'
                }).present();
            });
        });
        });
    }
}
