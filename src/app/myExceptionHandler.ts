import {ErrorHandler} from "@angular/core";
import {IonicErrorHandler} from "ionic-angular";

export class myExceptionHandler extends IonicErrorHandler implements ErrorHandler {
    handleError(err: any): void {
        console.log(err);
    }
}