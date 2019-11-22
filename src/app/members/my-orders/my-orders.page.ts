import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  outlets: any = [];
  orders: any = [];
  mixers: any = [];
  name: string = null;

  constructor(private rest: RestService,
    private loading: LoadingController,
    private storage: Storage) { }

  ngOnInit() {

    this.storage.ready().then(() => {

      this.loading.create({
        message: 'Getting Orders',
        showBackdrop: true,
      }).then(loading => {

        loading.present();


        this.storage.get('data').then((user: any) => {

          let id = null;

          this.storage.get("social").then((res2: any) => {

            if (res2 == 'facebook') {
              id = user.id;
              this.name = user.name;
            }
            else if (res2 == 'google') {
              id = user.userId;
              this.name = user.displayName;
            }

            else {
              id = user[0]._id;
              this.name = user[0].NAME;
            }

            this.rest.getOutlets().subscribe((res: any[]) => {

              this.outlets = res;

              this.rest.getOrdersList(id).subscribe((orders: any) => {

                console.log("Orders --> ", this.orders);
                if (orders.message) {
                  this.orders = [];
                }

                else {

                  //Iterate over orders and display:
                  orders.forEach(order => {

                    let orderString = "";
                    let mixerString = "";
                    let orderId = order[0].BILL;
                    let price = 0;
                    let name = order[0].USER_ID;
                    let outlet = this.findOutletById(order[0].OUTLET_ID);
                    let orderDate = order[0].createdAt.substring(0, 10);

                    order.forEach(element => {

                      price += element.TOTAL_PRICE_AFTER_TAX;
                      orderString = orderString.concat(element.PROD_QUAN.toString(), " X ", element.PRODUCT_NAME, ", ");

                      let mixerPrice = 0;

                      //Add mixers string seperately:
                      element.MIXER.forEach(mixer => {

                        mixerPrice += (mixer.MIXER_PRICE * mixer.MIXER_QUANTITY);
                        mixerString = mixerString.concat(mixer.MIXER_QUANTITY.toString(), " X ", mixer.MIXER_NAME, ", ");
                      });

                      price += mixerPrice;

                    });

                    // Merge both string and get the final items list:
                    let finalList = orderString.concat(mixerString);
                    finalList = finalList.substring(0, finalList.length - 2);

                    this.orders.push({
                      orderId: orderId,
                      finalPrice: price,
                      name: name,
                      outlet: outlet,
                      orderDate: orderDate,
                      orders: finalList
                    });
                  });
                }


                loading.dismiss();

              },

                err => {
                  loading.dismiss();
                });
            });

          });


        });
      });
    });
  }

  findOutletById(outletId) {

    let outletName = null;
    this.outlets.forEach(element => {
      if (element._id == outletId) {
        outletName = element.OUTLET_NAME;
      }
    });

    return outletName;
  }

}
