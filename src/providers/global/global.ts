import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

/*
 Generated class for the GlobalProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class GlobalProvider {
    public user_name: string;
    public user_email: string;
    public assessment_id;
    public domain;
    public training_id;
    public feedback_id;
    public assessment;
    public feedback;
    public home_page_name;
    public is_logged_in = false;

    constructor(public Toast: ToastController) {

    }

    showToast(message, duration = 3000, position = "bottom") {
        this.Toast.create({
            message: message,
            duration: duration,
            position: position
        }).present();
    }
}
