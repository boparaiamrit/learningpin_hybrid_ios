import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {MyTrainingPage} from "../my-trainings/my-trainings";
import {AssessmentsPage} from "../assessments/assessments";
import {LearningsPage} from "../learnings/learnings";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    username = "";
    TrainingRoot = MyTrainingPage;
    AssessmentRoot = AssessmentsPage;
    LearningRoot = LearningsPage;

    constructor(public navCtrl: NavController, private http: Http, private LocalStorage: Storage, private Toast: ToastController) {

    }
}
