import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform, App} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {GlobalProvider} from "../../providers/global/global";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-login',
    templateUrl: 'takeFeedback.html',
    styleUrls: ['assets/main.css'],
})
export class takeFeedback {
    domain = "";
    feedback = [];
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
    option5;
    selectedItem = 0;
    answerSelected = false;
    error: boolean = false;
    alert = this.alertCtrl.create({
        title: '',
        message: 'Are you sure you wanna cancel this feedback ? All progress will be lost.',
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
                    this.app.getRootNav().pop(takeFeedback);
                }
            }
        ]
    });

    constructor(private afAuth: AngularFireAuth, private http: Http, private app: App, public global: GlobalProvider, public platform: Platform, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        this.questions = global.feedback.questions;
        this.total_questions = this.questions.length;
        if (this.total_questions > 1) {
            this.count = 0;
            this.getQuestion(this.count);
        }

        platform.registerBackButtonAction(() => {
            this.alert.present();
        }, 1);
    }


    nextQuestion() {
        this.count += 1;
        if (this.count >= this.total_questions) {
            console.log("last question");
        } else {
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
        this.option5 = this.questions[counter].choicee;
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

    finishFeedback(feedback_id, training_id) {
        var options;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.LocalStorage.get('domain').then((domain) => {
            loading.present();
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                options = new RequestOptions({headers: headers});
                var link = domain + '/api/feedbacks/' + feedback_id;
                var mydata = {training_id: training_id, answers: JSON.stringify(this.answers)};
                this.http.post(link, mydata, options)
                    .subscribe(data => {
                        loading.dismiss();
                        var response = data.json();
                        if (response.success) {
                            this.global.showToast("Feedback completed successfully.", 3000, 'middle');
                            this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: "forward"});
                        }

                    }, error => {
                        loading.dismiss();
                        this.global.showToast("Something went wrong.Try again later.", 3000, 'middle');
                    });
            });
        });
    }

}
