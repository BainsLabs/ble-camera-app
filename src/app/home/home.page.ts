import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as aws from "aws-sdk";
import { BLE } from '@ionic-native/ble/ngx';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(private camera: Camera, private sanitized: DomSanitizer,private ble: BLE) {}
  image: SafeResourceUrl = '';
  message: any='';
  device: any='';
  error:any='';


  scan() {
    this.ble.scan([],60).subscribe(
      device => {

    this.message = "Scanning is started"
      this.device = JSON.stringify(device)
      if(device.id == "00:9D:6B:50:7E:91"){
      this.ble.connect("00:9D:6B:50:7E:91").subscribe(() => {this.message = `Connected to 00:9D:6B:50:7E:91` }, (err) => {this.message='Not connected' + JSON.stringify(err)});
      this.ble.stopScan()
    }else{
        this.message = "Not paired"
      }
    },
      err => {
      this.error = JSON.stringify(err)
      },
      () => {
      console.log("End of devices…");
      }
      );
  }

  upload(image, imageName) {
    return new Promise((resolve, reject) => {

      const S3 = new aws.S3({
        accessKeyId: 'AKIAXHUAJF5RUCEI34FS',
        secretAccessKey: '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',
        region: 'us-east-2'
      });
      let buf = new Buffer(image, "base64");

      var data = {
        Bucket: 'ble-camera',
        Key: imageName,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
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
        this.upload(imageData,'test').then(() => this.message = 'Uploaded SuccessFully').catch((err) => this.message = `Error - ${JSON.stringify(err)}`)

        this.image = (window as any).Ionic.WebView.convertFileSrc(imageData)
      },
      err => {
        // Handle error
        alert('error ' + JSON.stringify(err));
      }
    );
  }
}
