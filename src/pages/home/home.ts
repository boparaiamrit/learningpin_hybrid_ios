import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {MyTrainingPage} from "../my-trainings/my-trainings";
import {AssessmentsPage} from "../assessments/assessments";
import {LearningsPage} from "../learnings/learnings";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    username = "";
    TrainingRoot = MyTrainingPage;
    AssessmentRoot = AssessmentsPage;
    LearningRoot = LearningsPage;

    constructor(public navCtrl: NavController, public global: GlobalProvider) {
        this.global.home_page_name = "Trainings";
    }
}
