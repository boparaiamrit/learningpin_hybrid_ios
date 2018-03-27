import {Component} from "@angular/core";
import {
    NavController,
    ToastController,
    LoadingController,
    AlertController,
    ActionSheetController,
    Platform
} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {Calendar} from "@ionic-native/calendar";
import {GlobalProvider} from "../../providers/global/global";
import {Camera} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";

@Component({
    selector: 'training-attachments-page',
    templateUrl: 'training-attachments.html',
    styleUrls: ['assets/main.css'],
})
export class TrainingAttachments {
    domain = "";
    trainings_for_attachement = [];
    error: boolean = false;
    lastImage: string = null;
    loading;
    photo;
    trainingID;

    constructor(private afAuth: AngularFireAuth, public global: GlobalProvider, public camera: Camera, private http: Http, public navCtrl: NavController, public calender: Calendar, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public platform: Platform, private filePath: FilePath, public file: File, private transfer: FileTransfer) {
        this.trainings();
    }

    public trainings() {
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + this.global.token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/trainings-for-attachment';
                this.http.get(link, options).subscribe(data => {
                    this.trainings_for_attachement = data.json().my_trainings;
                }, error => {
                    this.global.showToast("Please login to proceed!", 2000, 'bottom');
                });
            });
        });
    }

    public attachfile(training_id) {
        this.trainingID = training_id;
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // this.photo = 'data:image/jpeg;base64,' + imageData;
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.global.showToast('Error while selecting image.', 2000, "bottom")
        });
    }

// Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

// Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.uploadImage();
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    private presentToast(text) {
        this.global.showToast(text, 2000, 'middle');
    }

// Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return this.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = this.global.domain + "/api/training/attach-file";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {'fileName': filename, "training_id": this.trainingID}
        };

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast("File uploaded successfully");
        }, err => {
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }
}
