import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-mixer-modal',
  templateUrl: './mixer-modal.component.html',
  styleUrls: ['./mixer-modal.component.scss'],
})
export class MixerModalComponent implements OnInit {

  @Input() header: string;
  @Input() count: number;
  @Input() type: string;
  @Input() data: any;

  
  quantityList: any[] = [];

  constructor(private storage: Storage,
    private modelCtrl: ModalController,
    private utils: UtilsService) { }


  ngOnInit() {

    for (let i = 1; i <= this.count; i++) {
      this.quantityList.push(i);
    }
  }

  selectCount(ct) {


    // If modal is from mixer page, save selected count and 
    // selected mixer in local storage
    if (this.type == 'M') {
      this.storage.set("MCount", ct);
      this.storage.set("Mixer", this.data);

      //Emit the event so that parent can listen to it
      this.utils.emitMixture();
      
      this.modelCtrl.dismiss({
        'dismissed': true
      });
    }
  }


}
