import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as aws from 'aws-sdk';
import { BLE } from '@ionic-native/ble/ngx';
import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(
    private camera: Camera,
    private sanitized: DomSanitizer,
    private ble: BLE,
    private router: Router
  ) {}
  image: SafeResourceUrl = '';
  message: any = '';
  error: any = '';
  devices: any = [];
  scan() {
    this.ble.scan([], 60).subscribe(
      device => {
        this.devices.push(device);
      },
      err => {
        this.error = JSON.stringify(err);
      },
      () => {
        console.log('End of devices…');
      }
    );
  }
  connect(deviceId) {
    this.ble.connect(deviceId).subscribe(
      peripheralData => {
        alert('connected');
        this.ble.stopScan();
        this.router.navigateByUrl('/docs');
      },
      peripheralData => {
        alert('disconnected');
      }
    );
  }
  upload(image, imageName) {
    return new Promise((resolve, reject) => {
      const S3 = new aws.S3({
        accessKeyId: '',
        secretAccessKey: '',
        region: ''
      });
      let buf = new Buffer(image, 'base64');

      var data = {
        Bucket: 'ble-camera',
        Key: imageName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };

      S3.upload(data, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  openCam() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.upload(imageData, 'test')
          .then(() => (this.message = 'Uploaded SuccessFully'))
          .catch(err => (this.message = `Error - ${JSON.stringify(err)}`));

        this.image = (window as any).Ionic.WebView.convertFileSrc(imageData);
      },
      err => {
        // Handle error
        alert('error ' + JSON.stringify(err));
      }
    );
  }
}
