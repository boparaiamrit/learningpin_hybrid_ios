import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController, Platform} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
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
    playbacktime = 0;

    constructor(private afAuth: AngularFireAuth, private http: Http, public global: GlobalProvider, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private streamingMedia: StreamingMedia, public platform: Platform, private transfer: FileTransfer, private file: File, private localNotifications: LocalNotifications,) {
        this.global.home_page_name = "Learning";
        this.learnings();
    }


    public learnings() {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/learnings';
                this.http.get(link, options).subscribe(data => {
                    // this.navCtrl.push(HomePage);
                    this.mylearnings = data.json().learnings;
                }, error => {
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    public download(url, name, file_id) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        this.file.checkFile(this.file.documentsDirectory, name).then(
            (result) => {
                if (this.downloading) {
                    this.global.showToast("Downloading is already in progress.", 2000, 'bottom');
                } else {
                    console.log("files found");
                    this.global.showToast("File already exists.", 2000, 'bottom');
                    this.fileExist = true;
                }
            }
        ).catch(
            (err) => {
                console.log("files not found ");
                if (this.downloading) {
                    this.global.showToast("Downloading is already in progress.", 2000, 'bottom');
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
                        duration: 3000,
                        position: 'middle'
                    }).present();

                    console.log(this.file.documentsDirectory + name);
                    console.log(url);

                    fileTransfer.download(url, this.file.documentsDirectory + name).then((entry) => {
                        this.localNotifications.clear(file_id);
                        this.global.showToast("Download Completed.", 2000, 'bottom');
                        this.downloading = false;
                        console.log('download complete: ' + entry.toURL());
                    }, (error) => {
                        console.log(error);
                        this.global.showToast("Oops! Something went wrong. Try again later.", 2000, 'bottom');
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

    public play(name, video_url, id, video_duration) {
        this.playbacktime = 0;
        var status = "Started";
        setTimeout(() => {
            this.playbacktime += 1;
        }, 1000);

        let options: StreamingVideoOptions = {
            orientation: 'landscape',
            successCallback: () => {
                if (this.playbacktime >= (video_duration * 0.8)) {
                    status = "Completed";
                }
                this.LocalStorage.get('domain').then((domain) => {
                    this.LocalStorage.get('user').then((user) => {
                        let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                        var options = new RequestOptions({headers: headers});
                        var link = domain + "/api/change/user-video-status?id=" + id + "&status=" + status;
                        // var link = domain + '/api/profile';
                        var mydata = "";
                        this.http.post(link, mydata, options)
                            .subscribe(data => {
                            }, error => {
                            });
                    });
                });
            },
        };
        this.file.checkFile(this.file.documentsDirectory, name).then(
            (result) => {
                this.streamingMedia.playVideo(this.file.documentsDirectory + name, options);
            }
        ).catch(
            (err) => {
                this.streamingMedia.playVideo(video_url, options);
            })
    }
}
