import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {HomePage} from "../home/home";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'learnings.html',
    styleUrls: ['assets/main.css'],
})
export class LearningsPage {
    domain = "";
    mylearnings = [];
    error: boolean = false;
    fileExist = false;
    downloading = false;

    constructor(private afAuth: AngularFireAuth, private http: Http, public global: GlobalProvider, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private streamingMedia: StreamingMedia, public platform: Platform, private transfer: FileTransfer, private file: File, private localNotifications: LocalNotifications,) {
        this.global.home_page_name = "Learning";
        this.learnings();
    }


    public learnings() {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/learnings';
                this.http.get(link, options).subscribe(data => {
                    // this.navCtrl.push(HomePage);
                    this.mylearnings = data.json().learnings;
                }, error => {
                    this.Toast.create({
                        message: 'Please login to proceed!',
                        duration: 2000,
                        position: 'bottom'
                    }).present();
                });
            });
        });
    }

    public download(url, name, file_id) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        this.file.checkFile(this.file.externalDataDirectory, name).then(
            (result) => {
                if (this.downloading) {
                    this.Toast.create({
                        message: 'Downloading is already in progress.',
                        duration: 1000,
                        position: 'bottom'
                    }).present();
                } else {
                    console.log("files found");
                    this.Toast.create({
                        message: 'File already exists.',
                        duration: 1000,
                        position: 'bottom'
                    }).present();
                    this.fileExist = true;
                }
            }
        ).catch(
            (err) => {
                console.log("files not found ");
                if (this.downloading) {
                    this.Toast.create({
                        message: 'Downloading is already in progress.',
                        duration: 1000,
                        position: 'bottom'
                    }).present();
                }
                else {
                    console.log(file_id);
                    this.localNotifications.schedule({
                        id: file_id,
                        title: name,
                        text: 'Downloading...',
                    });
                    this.Toast.create({
                        message: "Downloading...",
                        duration: 700,
                        position: 'middle'
                    }).present();

                    console.log(this.file.externalDataDirectory + name);
                    console.log(url);

                    fileTransfer.download(url, this.file.externalDataDirectory + name).then((entry) => {
                        this.localNotifications.clear(file_id);
                        this.Toast.create({
                            message: 'Download Completed.',
                            duration: 1000,
                            position: 'bottom'
                        }).present();
                        this.downloading = false;
                        console.log('download complete: ' + entry.toURL());
                    }, (error) => {
                        console.log(error);
                        this.Toast.create({
                            message: 'Oops! Something went wrong. Try again later.',
                            duration: 1000,
                            position: 'bottom'
                        }).present();
                    });

                    fileTransfer.onProgress((progressEvent) => {
                        this.downloading = true;
                        if (progressEvent.lengthComputable) {
                            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                            console.log(perc);
                        } else {

                        }
                    });
                }
            }
        )
    }

    public play(name, video_url) {
        let options: StreamingVideoOptions = {
            orientation: 'landscape',
        };
        this.file.checkFile(this.file.externalDataDirectory, name).then(
            (result) => {
                this.streamingMedia.playVideo(this.file.externalDataDirectory + name, options);
            }
        ).catch(
            (err) => {
                this.streamingMedia.playVideo(video_url, options);
            })
    }
}
