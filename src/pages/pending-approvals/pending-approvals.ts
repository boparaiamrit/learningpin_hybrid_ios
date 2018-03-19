import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'page-login',
    templateUrl: 'pending-approvals.html',
    styleUrls: ['assets/main.css'],
})
export class PendingApprovals {
    domain = "";
    pending_approvals = [];
    training_user_ids=[];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.approvals();
    }

    public approvals() {
        this.LocalStorage.get('domain').then((domain) => {

            this.LocalStorage.get('user').then((user) => {
            let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
            var options = new RequestOptions({headers: headers});
            var link = domain+'/api/trainings/pending-approvals';
            this.http.get(link, options).subscribe(data => {
                // this.navCtrl.push(HomePage);
                this.pending_approvals = data.json().pending_approvals;
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

    approveAll() {
        let alert = this.alertCtrl.create({
            title: '',
            message: '<div class="training-card training-popup-card"><div><h6>Are you sure you want to approve all?</h6></p></div></div>',
            buttons: [
                {
                    text: 'Approve Now',
                    handler: () => {
                        this.training_user_ids=[];
                        var options;
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        this.LocalStorage.get('domain').then((domain) => {
                            loading.present();
                            this.LocalStorage.get('user').then((user) => {
                                console.log(user.id);
                                // console.log(this.pending_approvals);
                                this.pending_approvals.forEach( pending_approval => {
                                    var obj = {};
                                    obj[pending_approval.training_id] = pending_approval.user_id;
                                    this.training_user_ids.push(obj) ;
                                });
                                console.log(this.training_user_ids);
                                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                                options = new RequestOptions({headers: headers});
                                var link = domain + '/api/trainings/approve-all';
                                var mydata = {
                                    'training_user_ids':this.training_user_ids,
                                };
                                this.http.post(link, mydata, options)
                                    .subscribe(data => {
                                        loading.dismiss();
                                        var response = data.json();
                                        var message = "";
                                        if (response.success) {
                                            message = "Trainings approved!"
                                            this.pending_approvals=[];
                                        } else {
                                            message = "Trainings not found."
                                        }
                                        this.Toast.create({
                                            message: message,
                                            duration: 3000,
                                            position: 'middle'
                                        }).present();
                                    }, error => {
                                        loading.dismiss();
                                        this.Toast.create({
                                            message: 'Something went wrong.Try again later.',
                                            duration: 3000,
                                            position: 'middle'
                                        }).present();
                                        // this.error = true;
                                    });
                            });
                        });
                    }
                }
            ]
        });
        alert.present();
    }
    reject(id,user_id,index) {
        let alert = this.alertCtrl.create({
            title: '',
            message: '<div class="training-card training-popup-card"><div><h5>Are you sure you want to Discard?</h5></p></div></div>',
            buttons: [
                {
                    text: 'Discard Now',
                    handler: () => {
                        var options;
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        this.LocalStorage.get('domain').then((domain) => {
                            loading.present();
                            this.LocalStorage.get('user').then((user) => {
                                console.log(user.id);
                                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                                options = new RequestOptions({headers: headers});
                                var link = domain + '/api/trainings/approve/' + id+"?action=Discard&user_id="+user_id;
                                var mydata = "";
                                this.http.post(link, mydata, options)
                                    .subscribe(data => {
                                        loading.dismiss();
                                        var response = data.json();
                                        var message = "";
                                        if (response.success) {
                                            this.pending_approvals.splice(index,1);
                                            message = "Training has been discarded!"
                                        } else {
                                            message = "Training not found."
                                        }
                                        this.Toast.create({
                                            message: message,
                                            duration: 3000,
                                            position: 'middle'
                                        }).present();
                                    }, error => {
                                        loading.dismiss();
                                        this.Toast.create({
                                            message: 'Something went wrong.Try again later.',
                                            duration: 3000,
                                            position: 'middle'
                                        }).present();
                                        // this.error = true;
                                    });
                            });
                        });
                    }
                }
            ]
        });
        alert.present();
    }
    approve(id,user_id,index) {
        this.LocalStorage.get('domain').then((domain) => {
            var options;
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                options = new RequestOptions({headers: headers});
                var link = domain + '/api/trainings/approve/' + id+"?action=Accept&user_id="+user_id;
                var mydata = "";
                this.http.post(link, mydata, options)
                    .subscribe(data => {
                        loading.dismiss();
                        var response = data.json();
                        var message = "";
                        if (response.success) {
                            this.pending_approvals.splice(index,1);
                            message = "Training has been approved successfully!"
                        } else {
                            message = "Training not found."
                        }
                        this.Toast.create({
                            message: message,
                            duration: 3000,
                            position: 'middle'
                        }).present();
                    }, error => {
                        loading.dismiss();
                        this.Toast.create({
                            message: 'Something went wrong.Try again later.',
                            duration: 3000,
                            position: 'middle'
                        }).present();
                    });
            });
        });
    }
}
