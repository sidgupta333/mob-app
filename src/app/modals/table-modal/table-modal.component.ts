import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-table-modal',
  templateUrl: './table-modal.component.html',
  styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit {

  @Input() header: string;
  @Input() count: number;
  @Input() type: string;
  @Input() data: any;

  
  quantityList: any[] = [];

  constructor(private storage: Storage,
    private modelCtrl: ModalController,
    private utils: UtilsService) { }


  ngOnInit() { 
      this.quantityList = this.data;
  }

  selectCount(item) {


    // If modal is from mixer page, save selected count and 
    // selected mixer in local storage
    if (this.type == 'T') {
      this.storage.set("TCount", item);
      
      
      //Emit the event so that parent can listen to it
      this.utils.emitTable();
      
      this.modelCtrl.dismiss({
        'dismissed': true
      });
    }
  }


}
