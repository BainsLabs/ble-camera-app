import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  public id: string;
  constructor(private ble: BLE, private route: ActivatedRoute) {}

  ngOnInit() {
    // this.id = this.route.snapshot.paramMap.get('deviceId');
    // this.ble.read(this.id, this.id, this.id).then(() => alert('test'));
  }
}
