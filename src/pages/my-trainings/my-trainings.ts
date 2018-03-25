import {Component, ViewChild} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Slides} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {Calendar} from "@ionic-native/calendar";
import {GlobalProvider} from "../../providers/global/global";


@Component({
    selector: 'mytrainings-page-home',
    templateUrl: 'my-trainings.html',
    styleUrls: ['assets/main.css'],
})
export class MyTrainingPage {
    domain = "";
    mytrainings = [];
    trainingDates = [];
    error: boolean = false;
    date: any;

    daysInThisMonth0: any;
    daysInLastMonth0: any;
    daysInNextMonth0: any;

    daysInThisMonth: any;
    daysInLastMonth: any;
    daysInNextMonth: any;

    daysInThisMonth1: any;
    daysInLastMonth1: any;
    daysInNextMonth1: any;

    monthNames: string[];
    dayNames: string[];
    currentMonth: any;
    currentYear: any;
    currentDate: any;
    currentRealDate: any;
    currentDay: any;
    numbers = [0, "", 1];
    firstLoad = true;

    @ViewChild(Slides) slider: Slides;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, public navCtrl: NavController, public calender: Calendar, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.date = new Date();
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.dayNames = ['Monday', "Tuesday", 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.trainings();
        this.getDaysOfMonth();
    }

    public trainings() {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/trainings';
                this.http.get(link, options).subscribe(data => {
                    this.mytrainings = data.json().my_trainings;
                    const mytrainingsString = JSON.stringify(this.mytrainings);
                    JSON.parse(mytrainingsString, (key, value) => {
                        if (key == 'date') {
                            this.trainingDates.push(value);
                        }
                    });
                }, error => {
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    public setClass(day) {
        if (day < 10) {
            return "currentDate more-padding";
        } else {
            return "currentDate";
        }
    }

    public calenderClick(calender_date) {
        let name = "", time = "", date = "", id = "";
        this.mytrainings.forEach(function (training) {
            if (training.date == calender_date) {
                name = training.name;
                time = training.time;
                date = training.date;
                id = training.id;
            }
            return false;
        });
        this.presentConfirm(name, time, date, id);
    }

    presentConfirm(name, time, date, id) {
        let alert = this.alertCtrl.create({
            title: '',
            message: '<div class="training-card training-popup-card"><div><h4>' + name + '</h4><p class="date">' + date + '</p><p class="time">' + time + '</p></div></div>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                },
                {
                    text: 'Enroll Now',
                    handler: () => {
                        var options;
                        let loading = this.loadingCtrl.create({
                            content: 'Please wait...'
                        });
                        this.LocalStorage.get('domain').then((domain) => {
                            loading.present();
                            this.LocalStorage.get('user').then((user) => {
                                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                                options = new RequestOptions({headers: headers});
                                var link = domain + '/api/trainings/enroll/' + id;
                                var mydata = "";
                                this.http.post(link, mydata, options)
                                    .subscribe(data => {
                                        loading.dismiss();
                                        var response = data.json();
                                        var message = "";
                                        if (response.success) {
                                            message = "Training has been enrolled successfully!"
                                        } else {
                                            message = "Already enrolled."
                                        }
                                        this.global.showToast(message, 3000, 'bottom');
                                    }, error => {
                                        loading.dismiss();
                                        this.global.showToast("Something went wrong.Try again later.", 2000, 'bottom');
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

    getDaysOfMonth() {

        this.daysInThisMonth0 = new Array();
        this.daysInThisMonth = new Array();
        this.daysInThisMonth1 = new Array();

        this.daysInLastMonth0 = new Array();
        this.daysInLastMonth = new Array();
        this.daysInLastMonth1 = new Array();

        this.daysInNextMonth0 = new Array();
        this.daysInNextMonth = new Array();
        this.daysInNextMonth1 = new Array();

        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        this.currentRealDate = new Date().getDate();
        this.currentDay = this.dayNames[this.date.getDay()];
        if (this.date.getMonth() === new Date().getMonth()) {
            this.currentDate = new Date().getDate();
        } else {
            this.currentDate = 999;
        }


        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth0.push(i);
        }

        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth.push(i);
        }

        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth1.push(i);
        }


        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            this.daysInThisMonth0.push(i + 1);
        }


        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            this.daysInThisMonth.push(i + 1);
        }


        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            this.daysInThisMonth1.push(i + 1);
        }


        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth0.push(i + 1);
        }
        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth.push(i + 1);
        }
        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 3, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth1.push(i + 1);
        }

    }

    goToLastMonth() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.getDaysOfMonth();
    }

    goToNextMonth() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.getDaysOfMonth();
    }

    loadPrev() {
        console.log('Prev');
        let newIndex = this.slider.getActiveIndex();

        newIndex++;
        // this.numbers.unshift(this.numbers[0] - 1);
        // this.numbers.pop();

        // Workaround to make it work: breaks the animation
        this.slider.slideTo(newIndex, 0, false);

        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.getDaysOfMonth();
        console.log(`New status: ${this.numbers}`);
    }

    loadNext() {
        if (this.firstLoad) {
            // Since the initial slide is 1, prevent the first
            // movement to modify the slides
            this.firstLoad = false;
            return;
        }


        console.log('Next');
        let newIndex = this.slider.getActiveIndex();
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.getDaysOfMonth();

        newIndex--;
        // this.numbers.push(this.numbers[this.numbers.length - 1] + 1);
        // this.numbers.shift();

        // Workaround to make it work: breaks the animation
        this.slider.slideTo(newIndex, 0, false);

        console.log(`New status: ${this.numbers}`);
    }
}
