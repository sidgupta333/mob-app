import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RestService } from 'src/app/services/rest.service';
import { LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ModalController } from '@ionic/angular';
import { MixerModalComponent } from 'src/app/modals/mixer-modal/mixer-modal.component';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mixers',
  templateUrl: './mixers.page.html',
  styleUrls: ['./mixers.page.scss'],
})
export class MixersPage implements OnInit {

  mixers: any[] = [];
  quantities: number;

  constructor(private storage: Storage,
    private http: RestService,
    private loading: LoadingController,
    private dialog: Dialogs,
    private modal: ModalController,
    private utils: UtilsService,
    private router: Router, ) { }

  ngOnInit() {


    this.loading.create({
      message: 'Getting Mixers data',
      showBackdrop: true,
    }).then(loading => {

      loading.present();

      //Get quantities count:
      this.http.getQuantities().subscribe((res: any[]) => {

        res.forEach(element => {

          if (element.QUANTITY_TYPE == 'M') {
            this.quantities = element.QUANTITY;
          }
        });
      })

      // Get all the mixers type
      this.http.getMixers().subscribe((res: any[]) => {

        let tempMixers = [];

        res.forEach(element => {
          tempMixers.push({
            _id: element._id,
            NAME: element.NAME,
            PRICE: element.PRICE,
            quantity: null,
            closeEnable: false
          })
        });

        this.mixers = tempMixers;

        loading.dismiss();
      },
        err => {
          loading.dismiss();
          this.dialog.alert("Couldn't fetch Mixers data.", "Failed");
        });
    });


    // Listen to emitter value of modal:
    this.utils.mixerEmitter.subscribe((res) => {
      if (res) {

        //Map a new response received by modal:
        this.mapSelection();
      }
    });

  }


  async openModalCount(mixer: any) {
    const model = await this.modal.create({
      component: MixerModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        'header': 'Select Quantity',
        'count': this.quantities,
        'type': 'M',
        'data': mixer
      }
    });

    model.present();
  }

  //Map selected values from the local storage:
  mapSelection() {
    this.storage.ready().then(() => {
      this.storage.get("MCount").then((res: any) => {
        let count = res;

        this.storage.get("Mixer").then((res2: any) => {
          let mixer = res2;

          this.mixers.forEach(element => {
            if (mixer._id == element._id) {
              element.quantity = count;
              element.closeEnable = true;
            }
          });

          this.storage.remove('MCount');
          this.storage.remove('Mixer');
        });
      });
    });

  }


  // Remove the selected values:
  removeSelection(mixer) {
    this.mixers.forEach((element) => {

      if (element._id == mixer._id) {
        element.quantity = null;
        element.closeEnable = false;
      }
    });
  }


  // Proceed for order:
  proceed() {

    //Map together the mixers selected and save it to local storage:
    let mixtureSelected = [];

    this.mixers.forEach((element) => {
      if (element.closeEnable) {
        mixtureSelected.push(element);
      }
    });

    this.storage.remove('TCount');
    this.storage.set('Mixtures', mixtureSelected);
    this.router.navigate(['members', 'orderSummary']);
  }

  skipMixers() {
    this.router.navigate(['members', 'orderSummary']);
  }



  doRefresh(event) {

    this.quantities = 0;
    this.ngOnInit();
    event.target.complete();
  }

}
