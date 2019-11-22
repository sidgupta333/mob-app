import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() header: string;
  @Input() count: number;
  @Input() type: string;
  @Input() data: any

  quantityList: any[] = [];

  constructor(private storage: Storage,
    private router: Router,
    private modelCtrl: ModalController) { }


  ngOnInit() {

    for (let i = 1; i <= this.count; i++) {
      this.quantityList.push(i);
    }
  }

  selectCount(ct) {

    // If modal is from product page, Save selected count and selected drink in local storage
    if (this.type == 'P') {
      this.storage.set("PCount", ct);
      this.storage.set("Drink", this.data);
      this.modelCtrl.dismiss({
        'dismissed': true
      });
      this.router.navigate(['members', 'mixers']);
    }
  }

}
