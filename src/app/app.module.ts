import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {StatusBar} from "@ionic-native/status-bar";
import {Keyboard} from "@ionic-native/keyboard";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StreamingMedia} from "@ionic-native/streaming-media";
import {LoginPage} from "../pages/login/login";
import {HttpModule} from "@angular/http";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {IonicStorageModule} from "@ionic/storage";
import {environment} from "../environments/environment";
import {DomainPage} from "../pages/domain/domain";
import {MyTrainingPage} from "../pages/my-trainings/my-trainings";
import {LogoutPage} from "../pages/logout/logout";
import {AssessmentsPage} from "../pages/assessments/assessments";
import {LearningsPage} from "../pages/learnings/learnings";
import {myExceptionHandler} from "./myExceptionHandler";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {PendingApprovals} from "../pages/pending-approvals/pending-approvals";
import {ApprovedTrainings} from "../pages/approved-trainings/approved-trainings";
import {GlobalProvider} from '../providers/global/global';
import {Calendar} from '@ionic-native/calendar';
import {Slides} from 'ionic-angular';
import {giveAssessment} from "../pages/giveAssessment/giveAssessment";
import {takeAssessment} from "../pages/takeAssessment/takeAssessment";
import {CompletedAssessments} from "../pages/completed-assessments/completed-assessments";
import {CompletedTrainings} from "../pages/completed-trainings/completed-trainings";
import {takeFeedback} from "../pages/takeFeedback/takeFeedback";
import {Profile} from "../pages/profile/profile";
import {RoundProgressModule, RoundProgressConfig} from 'angular-svg-round-progressbar';
import {Mydownloads} from "../pages/mydownloads/mydownloads";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        LoginPage,
        DomainPage,
        LogoutPage,
        LearningsPage,
        AssessmentsPage,
        MyTrainingPage,
        PendingApprovals,
        ApprovedTrainings,
        giveAssessment,
        takeAssessment,
        CompletedAssessments,
        CompletedTrainings,
        takeFeedback,
        Profile,
        Mydownloads,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        IonicStorageModule.forRoot(),
        RoundProgressModule,
        IonicModule.forRoot(MyApp
            /*
             * MODIFY BOOTSTRAP CODE BELOW
             * Adds a config object that disables scrollAssist and autoFocusAssist for iOS only
             * https://github.com/driftyco/ionic/issues/5571
             */
            , {
                platforms: {
                    ios: {
                        // These options are available in ionic-angular@2.0.0-beta.2 and up.
                        scrollAssist: false,    // Valid options appear to be [true, false]
                        autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
                    },
                    android: {
                        // These options are available in ionic-angular@2.0.0-beta.2 and up.
                        scrollAssist: false,    // Valid options appear to be [true, false]
                        autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
                    }
                    // http://ionicframework.com/docs/v2/api/config/Config/)
                }
            }
            /*
             * END MODIFY
             */
        )
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        LoginPage,
        DomainPage,
        LogoutPage,
        AssessmentsPage,
        LearningsPage,
        MyTrainingPage,
        PendingApprovals,
        ApprovedTrainings,
        giveAssessment,
        takeAssessment,
        CompletedAssessments,
        CompletedTrainings,
        takeFeedback,
        Profile,
        Mydownloads,
    ],
    providers: [
        StatusBar,
        FileTransfer,
        File,
        LocalNotifications,
        SplashScreen,
        Calendar,
        Slides,
        Keyboard,
        StreamingMedia,
        GlobalProvider,
        RoundProgressConfig,
        RoundProgressModule,
        {provide: ErrorHandler, useClass: myExceptionHandler},
    ]
})
export class AppModule {
}
