import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.page.html',
  styleUrls: ['./notif.page.scss'],
})
export class NotifPage implements OnInit {

  notif: object = {};

  constructor(private storage: Storage) { }

  ngOnInit() {

    //Get Notification description:
    this.storage.ready().then(() => {
      this.storage.get('notif').then((res: any) => {
        this.notif = res;
      });
    });

  }

}
