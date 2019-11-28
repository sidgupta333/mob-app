import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  drinksData: any[] = [];
  serverPath: string = null;
  quantities: number;
  notif: object = {
    _id: null,
    desc1: null,
    desc2: null
  };

  constructor(private http: RestService,
    private loading: LoadingController,
    private dialogs: Dialogs,
    private modal: ModalController,
    private storage: Storage,
    private router: Router) { }

  ngOnInit() {


    // Get server path to fetch images:
    this.serverPath = this.http.getServer();

    // Show loader
    this.loading.create({
      message: 'Getting Drinks Data',
      showBackdrop: true,
    }).then(loading => {

      loading.present();

      // Get quantities from server:
      this.http.getQuantities().subscribe((res: any) => {

        res.forEach(element => {

          if (element.QUANTITY_TYPE == 'P') {
            this.quantities = element.QUANTITY;
          }
        });
      });

      //Get Notification description:
      this.storage.ready().then(() => {
        this.storage.get('outlet').then((res: any) => {
          let outletId = res._id;

          this.http.getNotif(outletId).subscribe((res: any) => {
            this.notif = {
              _id: res._id,
              desc1: res.NOTIF_DESC,
              desc2: res.NOTIF_DESC2,
            };
            this.storage.set("notif", this.notif);

          });

        });
      });


      // Get all the types of drinks from Server
      this.http.getTypes().subscribe((res1: any) => {

        // Get all the types of drinks from Server
        this.http.getDrinks().subscribe((res2: any) => {

          //Map all the types with corresponding drinks:
          res1.forEach(type => {

            let typeId = type._id;
            let drinks = [];

            res2.forEach(drink => {
              if (drink.TYPE_ID == typeId) {
                drinks.push({
                  _id: drink._id,
                  NAME: drink.NAME,
                  TYPE_ID: drink.TYPE_ID,
                  MIN_PRICE: drink.MIN_PRICE,
                  MAX_PRICE: drink.MAX_PRICE,
                  PRESENT_PRICE: this.randomNumber(drink.MIN_PRICE, drink.MAX_PRICE),
                  changeInterval: this.randomNumber(1, 10),
                  increaseFlag: true
                })
              }
            });

            this.drinksData.push({
              _id: typeId,
              NAME: type.NAME,
              IMAGE_PATH: this.serverPath.concat(type.IMAGE_PATH),
              drinks: [...drinks]
            });
          });

          loading.dismiss();

          // Update the price of drinks randomly every 3 seconds
          window.setInterval(() => {

            this.updateLivePrice();
          }, 1000);

        },
          err => {
            loading.dismiss();
            this.dialogs.alert("Unable to connect to server, please check your connection.", "Connection failed");
          });
      },
        err => {
          loading.dismiss();
          this.dialogs.alert("Unable to connect to server, please check your connection.", "Connection failed");
        })
    });
  }


  // Run this method every 3 seconds to update the live price:
  // Method which generated new price with specific delay
  updateLivePrice() {

    this.drinksData.forEach(type => {

      type.drinks.forEach(drink => {

        setTimeout(() => {
          let newPrice = this.randomNumber(drink.MIN_PRICE, drink.MAX_PRICE);
          if (newPrice > drink.PRESENT_PRICE) {
            drink.increaseFlag = true;
          }
          else {
            drink.increaseFlag = false;
          }

          drink.PRESENT_PRICE = newPrice;

        }, drink.changeInterval * 1000)

      });
    });
  }



  // Method to generate random number:
  randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  // Display select count modal:
  async showQuantityModal(drink: any) {
    const modal = await this.modal.create({
      component: ModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        'header': 'Select Quantity (per 30 ml)',
        'count': this.quantities,
        'type': 'P',
        'data': drink
      }
    });

    modal.present();
  }


  //Navigate to notif:
  navigateToNotif() {
    this.router.navigate(['members', 'notif']);
  }

}
