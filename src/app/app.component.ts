import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {HomePage} from "../pages/home/home";
import {DomainPage} from "../pages/domain/domain";
import {LogoutPage} from "../pages/logout/logout";
import {PendingApprovals} from "../pages/pending-approvals/pending-approvals";
import {Headers, RequestOptions} from "@angular/http";
import {Storage} from "@ionic/storage";
import {GlobalProvider} from "../providers/global/global";
import {ApprovedTrainings} from "../pages/approved-trainings/approved-trainings";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = DomainPage;

    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public LocalStorage: Storage,public splashScreen: SplashScreen, public global: GlobalProvider) {
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: HomePage},
            {title: 'Pending Approvals', component: PendingApprovals},
            {title: 'Approved Trainings', component: ApprovedTrainings},
            {title: 'Logout', component: LogoutPage}
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
