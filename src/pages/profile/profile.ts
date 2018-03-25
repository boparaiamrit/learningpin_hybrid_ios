import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'profile.html',
    styleUrls: ['assets/main.css'],
})
export class Profile {
    user_data = [];
    name;
    email;
    password;
    user_state;
    user_city;
    states = [];
    cities = [];

    constructor(private afAuth: AngularFireAuth, private http: Http, private app: App, public global: GlobalProvider, public platform: Platform, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        platform.registerBackButtonAction(() => {

        }, 1);
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.name = this.global.user_name;
        this.email = this.global.user_email;
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/profile-with-state-city';
                this.http.get(link, options).subscribe(data => {
                    loading.dismiss();
                    this.user_data = data.json().user;
                    this.states = data.json().states;
                    this.user_state = data.json().user.state_id;
                    this.user_city = data.json().user.city_id;
                    this.cities = data.json().cities;
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

    public getCities(state_id) {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/meta/cities/' + state_id;
                this.http.get(link, options).subscribe(data => {
                    this.cities = data.json();
                    this.user_city = this.cities[0].id;
                }, error => {
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    public updateProfile() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/profile';
                var myData = {
                    password: this.password,
                    name: this.name,
                    email: this.email,
                    state_id: this.user_state,
                    city_id: this.user_city
                };
                this.http.post(link, myData, options)
                    .subscribe(data => {
                        loading.dismiss();
                        this.global.showToast("Profile updated successfully.", 2000, 'bottom');
                        var updated_data = data.json();
                        this.global.user_name = updated_data.name;
                        this.global.user_email = updated_data.email;
                    }, error => {
                        console.log(error);
                        var errors;
                        loading.dismiss();
                        if (error.status == 403) {
                            errors = error.json().errors;
                            for (var first_error in error.json().errors) break;
                            this.global.showToast(errors[first_error][0], 2000, 'bottom');
                        } else {
                            this.global.showToast("Something went wrong.", 2000, 'bottom');
                        }
                    });
            });
        });
    }
}
