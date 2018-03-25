import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController} from "ionic-angular";
import {Http} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {GlobalProvider} from "../../providers/global/global";

@Component({
    selector: 'page-login',
    templateUrl: 'mydownloads.html',
    styleUrls: ['assets/main.css'],
})
export class Mydownloads {
    domain = "";
    files = [];
    error: boolean = false;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, private http: Http, public file: File, private streamingMedia: StreamingMedia, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        file.listDir(file.documentsDirectory, '').then((result) => {
            console.log(result);
            /*result will have an array of file objects with
             file details or if its a directory*/
            for (let file of result) {
                if (file.isDirectory == true && file.name != '.' && file.name != '..') {
                    // Code if its a folder
                } else if (file.isFile == true) {
                    this.files.push(file);
                    // Code if its a file
                    let name = file.name // File name
                    // let path = file.path // File path
                    file.getMetadata(function (metadata) {
                        console.log(metadata);
                        let size = metadata.size; // Get file size
                    })
                }
            }
        });
    }

    public play(name, video_url) {
        let options: StreamingVideoOptions = {
            orientation: 'landscape',
        };
        this.file.checkFile(this.file.documentsDirectory, name).then(
            (result) => {
                this.streamingMedia.playVideo(video_url, options);
            }
        ).catch(
            (err) => {
                this.global.showToast("File not found.", 2000, 'bottom');
            })
    }
}