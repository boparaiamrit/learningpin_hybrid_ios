import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {GlobalProvider} from "../../providers/global/global";
import {HomePage} from "../home/home";
import moment from "moment";
import {RoundProgressModule} from "angular-svg-round-progressbar";

@Component({
    selector: 'page-login',
    templateUrl: 'takeAssessment.html',
    styleUrls: ['assets/main.css'],
})
export class takeAssessment {
    domain = "";
    assessment = [];
    total_questions;
    count: number;
    answers = [];
    questions;
    question_id: number;
    question;
    option1;
    option2;
    option3;
    option4;
    selectedItem = 0;
    answerSelected = false;
    error: boolean = false;
    mytimeout = null; // the current timeoutID
    timer;
    current_timer;
    current_question = 1;
    alert = this.alertCtrl.create({
        title: '',
        message: 'Are you sure you wanna cancel this test ? All progress will be lost.',
        buttons: [
            {
                text: 'No',
                handler: () => {
                    this.alert.dismiss();
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.app.getRootNav().pop(takeAssessment);
                }
            }
        ]
    });

    constructor(private afAuth: AngularFireAuth, private http: Http, private app: App, public starter: RoundProgressModule, public global: GlobalProvider, public platform: Platform, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.questions = global.assessment.questions;
        this.total_questions = this.questions.length;
        if (this.total_questions > 1) {
            this.count = 0;
            this.timer = global.assessment.time_in_sec;
            this.current_timer = this.timer;
            this.getQuestion(this.count);
        }

        if (this.timer != null) {
            this.timeout();
        }

        platform.registerBackButtonAction(() => {
            // this.app.getRootNav().pop(takeAssessment);
            this.alert.present();

        }, 1);
    }

    timeout() {
        setTimeout(() => {
            if (this.current_timer === 0) {
                this.finishAssessment(this.global.assessment_id, this.global.training_id);
                return;
            }
            this.current_timer--;
            setTimeout(() => {
                this.timeout();
            }, 1000);
        }, 1000);
    }


    nextQuestion() {
        this.count += 1;
        if (this.count >= this.total_questions) {
            console.log("last question");
        } else {
            this.current_question += 1;
            this.getQuestion(this.count);
        }
    }


    getQuestion(counter) {
        this.answerSelected = false;
        this.selectedItem = 0;
        this.question_id = this.questions[counter].id;
        this.question = this.questions[counter].question;
        this.option1 = this.questions[counter].choicea;
        this.option2 = this.questions[counter].choiceb;
        this.option3 = this.questions[counter].choicec;
        this.option4 = this.questions[counter].choiced;
    }

    selectOption(optionNumber, questionID, answer) {
        this.selectedItem = optionNumber;
        if (this.answerSelected) {
            this.answers.pop();
        }
        this.answerSelected = true;
        this.answers.push({question_id: questionID, option: answer});
        console.log(this.answers);
    }

    finishAssessment(assessment_id, training_id) {
        var options;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.LocalStorage.get('domain').then((domain) => {
            loading.present();
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                options = new RequestOptions({headers: headers});
                var link = domain + '/api/assessments/' + assessment_id;
                var mydata = {training_id: training_id, answers: this.answers};
                this.http.post(link, mydata, options)
                    .subscribe(data => {
                        loading.dismiss();
                        var response = data.json();
                        if (response.success) {
                            this.global.showToast("Assessment completed successfully.", 2000, 'bottom');
                            this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: "forward"});
                        }

                    }, error => {
                        loading.dismiss();
                        this.global.showToast("Something went wrong.Try again later.", 2000, 'bottom');
                    });
            });
        });
    }

    public humanizeDurationTimer = function (input, units) {
        // units is a string with possible values of y, M, w, d, h, m, s, ms
        if (input == 0) {
            return 0;
        } else {
            var duration = moment().startOf('day').add(input, units);
            var format = "";
            if (duration.hour() > 0) {
                format += "H[h] ";
            }
            if (duration.minute() > 0) {
                format += "m[m] ";
            }
            if (duration.second() > 0) {
                format += "s[s] ";
            }
            return duration.format(format);
        }
    };
}
