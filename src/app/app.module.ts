import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {StatusBar} from "@ionic-native/status-bar";
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
import { GlobalProvider } from '../providers/global/global';
import { Calendar } from '@ionic-native/calendar';
import { Slides } from 'ionic-angular';
import {giveAssessment} from "../pages/giveAssessment/giveAssessment";
import {takeAssessment} from "../pages/takeAssessment/takeAssessment";


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
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(MyApp),
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
    ],
    providers: [
        StatusBar,
        FileTransfer,
        File,
        LocalNotifications,
        SplashScreen,
        Calendar,
        Slides,
        StreamingMedia,
        GlobalProvider,
        {provide: ErrorHandler, useClass: myExceptionHandler},
    ]
})
export class AppModule {
}
