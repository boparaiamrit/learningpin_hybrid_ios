import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController, AlertController} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {AngularFireAuth} from "angularfire2/auth";
import {Storage} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {AmChartsService, AmChart} from "@amcharts/amcharts3-angular";

@Component({
    selector: 'page-login',
    templateUrl: 'idp.html',
    styleUrls: ['assets/main.css'],
})
export class IDP {
    private trainingChart: AmChart;
    private assessmenstChart: AmChart;
    private videosChart: AmChart;
    domain = "";
    files = [];
    error: boolean = false;
    trainingsData = [
        {
            "title": "Dummy",
            "value": 40
        }, {
            "title": "Dummy1",
            "value": 22
        }, {
            "title": "Dummy2",
            "value": 38
        },
    ];

    constructor(private AmCharts: AmChartsService, private afAuth: AngularFireAuth, private http: Http, public file: File, private streamingMedia: StreamingMedia, public navCtrl: NavController, public Toast: ToastController, public LocalStorage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    }

    ionViewDidEnter() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.LocalStorage.get('domain').then((domain) => {
            this.LocalStorage.get('user').then((user) => {
                let headers = new Headers({'Authorization': 'Bearer ' + user.api_token});
                var options = new RequestOptions({headers: headers});
                var link = domain + '/api/user/idp/report';
                this.http.get(link, options).subscribe(data => {
                    loading.dismiss();
                    this.trainingsData = data.json().trainings_data;
                    this.trainingChart = this.AmCharts.makeChart("trainings_chart", {
                        "type": "pie",
                        "theme": "light",
                        "dataProvider": JSON.parse(data.json().trainings_data),
                        "titleField": "title",
                        "valueField": "value",
                        "colorField": "color",
                        "labelRadius": 5,
                        "radius": "40%",
                        "innerRadius": "60%",
                        "labelText": "[[value]]%",
                        "export": {
                            "enabled": false
                        },
                        "allLabels": [{
                            "y": "46%",
                            "align": "center",
                            "size": 15,
                            "text": "Trainings",
                            "color": "#000000"
                        }, {
                            "y": "46%",
                            "align": "center",
                            "size": 25,
                            "text": "____",
                            "color": "#ffca2c"
                        }],
                    });
                    this.assessmenstChart = this.AmCharts.makeChart("assessments_chart", {
                        "type": "pie",
                        "theme": "light",
                        "dataProvider": JSON.parse(data.json().assessments_data),
                        "titleField": "title",
                        "valueField": "value",
                        "colorField": "color",
                        "labelRadius": 5,
                        "radius": "40%",
                        "innerRadius": "60%",
                        "labelText": "[[value]]%",
                        "export": {
                            "enabled": false
                        },
                        "allLabels": [{
                            "y": "46%",
                            "align": "center",
                            "size": 15,
                            "text": "Assessments",
                            "color": "#000000"
                        }, {
                            "y": "46%",
                            "align": "center",
                            "size": 25,
                            "text": "____",
                            "color": "#ffca2c"
                        }],
                    });
                    this.videosChart = this.AmCharts.makeChart("videos_chart", {
                        "type": "pie",
                        "theme": "light",
                        "dataProvider": JSON.parse(data.json().videos_data),
                        "titleField": "title",
                        "valueField": "value",
                        "colorField": "color",
                        "labelRadius": 5,
                        "radius": "40%",
                        "innerRadius": "60%",
                        "labelText": "[[value]]%",
                        "export": {
                            "enabled": false
                        },
                        "allLabels": [{
                            "y": "46%",
                            "align": "center",
                            "size": 15,
                            "text": "Videos",
                            "color": "#000000"
                        }, {
                            "y": "46%",
                            "align": "center",
                            "size": 25,
                            "text": "____",
                            "color": "#ffca2c"
                        }],
                    });
                }, error => {
                    loading.dismiss();
                    this.Toast.create({
                        message: 'Please login to proceed!',
                        duration: 2000,
                        position: 'bottom'
                    }).present();
                });
            });
        });
    }
}
