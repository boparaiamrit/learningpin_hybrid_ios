import {Injectable} from '@angular/core';

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

    constructor() {

    }

}
