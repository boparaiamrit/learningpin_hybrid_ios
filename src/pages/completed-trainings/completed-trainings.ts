import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {Calendar} from "@ionic-native/calendar";
import {GlobalProvider} from "../../providers/global/global";
import {takeFeedback} from "../takeFeedback/takeFeedback";


@Component({
    selector: 'page-login',
    templateUrl: 'completed-trainings.html',
    styleUrls: ['assets/main.css'],
})
export class CompletedTrainings {
    domain = "";
    completed_trainings = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, private app: App, public navCtrl: NavController, public calender: Calendar, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.trainings();
    }

    public trainings() {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/trainings/completed';
                this.http.get(link, options).subscribe(data => {
                    this.completed_trainings = data.json().complete_trainings;
                }, error => {
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    giveFeedback(name, time, date, id, feedback_id) {
        let alert = this.alertCtrl.create({
            title: '',
            message: '<div class="training-card training-popup-card"><div><h5>' + name + '</h5><p class="time">' + time + '</p></div><div><p class="date">' + date + '</p></div></div>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                },
                {
                    text: 'Give Feedback',
                    handler: () => {
                        var options;
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });

                        this.global.feedback_id = feedback_id;

                        this.global.training_id = id;
                        loading.present();
                        this.LocalStorage.get('domain').then((domain) => {
                            loading.present();
                            this.LocalStorage.get('user').then((user) => {
                                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                                var options = new RequestOptions({headers: headers});
                                var link = domain + '/api/feedbacks/' + feedback_id + "?training_id=" + id;
                                this.http.get(link, options).subscribe(data => {
                                    // this.navCtrl.push(HomePage);
                                    loading.dismiss();
                                    let response = data.json();
                                    this.global.feedback = response.feedback;
                                    // this.navCtrl.push(giveAssessment);
                                    console.log(this.global.feedback);
                                    if (response.success) {
                                        this.app.getRootNav().push(takeFeedback);
                                    } else {
                                        this.global.showToast(response.message, 2000, 'bottom');
                                    }
                                }, error => {
                                    loading.dismiss();
                                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                                });
                            });
                        });
                    }
                }
            ]
        });
        alert.present();
    }
}
