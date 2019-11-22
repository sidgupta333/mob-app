import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RestService } from 'src/app/services/rest.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {

  orderItems: any[] = [];
  total: number = 0;
  tableCount: number = 0;
  quantities: number = 0;
  outlet: any = null;
  userId: any = null;
  tableNumber: any = null;

  constructor(private storage: Storage,
    private http: RestService,
    private dialog: Dialogs,
    private utils: UtilsService,
    private loading: LoadingController,
    private router: Router) { }

  ngOnInit() {

    this.loading.create({
      message: 'Getting Table data',
      showBackdrop: true
    }).then((loading) => {

      loading.present();

      this.http.getQuantities().subscribe((res: any[]) => {

        res.forEach(element => {
          if (element.QUANTITY_TYPE == 'T') {
            this.quantities = element.QUANTITY;
          }
        });

        loading.dismiss();
      });

    });


    // Listen to emitter value of modal:
    this.utils.tableEmitter.subscribe((res) => {
      if (res) {

        //Map a new response received by modal:
        this.storage.ready().then(() => {
          this.storage.get('TCount').then((res: any) => {
            this.tableCount = res;
          });
        });
      }
    });

    // Fetch the drink selected at main dashboard:
    this.storage.ready().then(() => {
      this.storage.get("Drink").then((res: any) => {
        this.storage.get("PCount").then((count) => {

          this.orderItems.push({
            item: res,
            id: res._id,
            NAME: res.NAME,
            PRICE: res.PRESENT_PRICE,
            count: count,
            total: res.PRESENT_PRICE * count
          });

          this.total += (res.PRESENT_PRICE * count);


          // Get mixers details:
          this.storage.get("Mixtures").then((mixture: any) => {

            if (mixture) {
              mixture.forEach(m => {
                this.orderItems.push({
                  item: m,
                  id: m._id,
                  NAME: m.NAME,
                  PRICE: m.PRICE,
                  count: m.quantity,
                  total: m.PRICE * m.quantity
                });

                this.total += (m.PRICE * m.quantity);
              });
            }
          });
        });

        // Get outlet details:
        this.storage.get("outlet").then((res => {
          this.outlet = res;
        }));

        //Get table details:
        this.storage.get("table").then((res => {
          this.tableNumber = res;
        }));

        //Get user details:
        this.storage.get("social").then((res: any) => {

          if (res == 'facebook') {
            this.storage.get("data").then((res2: any) => {
              console.log("USER++> ", res2);
              this.userId = res2.id;
            });
          }
          else if (res == 'google') {
            this.storage.get("data").then((res2: any) => {
              console.log("USER++> ", res2);
              this.userId = res2.userId;
            });
          }
          else {
            this.storage.get("data").then((res2: any) => {
              console.log("USER++> ", res2);
              this.userId = res2[0]._id;
            });
          }
        })
      });
    });

  }


  // Confirm order selected
  confirm() {

    // DTO for creating order:

    let dto = {
      USER_ID: this.userId,
      PROD_ID: this.orderItems[0].id,
      PRICE: this.orderItems[0].PRICE,
      PROD_QUAN: this.orderItems[0].count,
      TABLE_ID: this.tableCount,
      OUTLET_ID: this.outlet._id,
      MIXER: []
    };

    this.orderItems.forEach((item, i) => {
      if (i > 0) {
        dto.MIXER.push({
          MIXER_ID: item.id,
          MIXER_QUANTITY: item.count
        });
      }
    });

    console.log("Order: ", dto);

    this.loading.create({
      message: 'Creating Order',
      showBackdrop: true
    }).then((loading) => {

      loading.present();

      this.http.createOrder(dto).subscribe((res) => {
        loading.dismiss().then((res) => {

          this.dialog.alert("Your order placed successfully!", "SUCCESS").then(() => {
            this.router.navigate(['members', 'menu', 'dashboard']);
          });
        });

      },
        err => {
          loading.dismiss().then((res) => {
            console.log(err);
            this.dialog.alert("Order Creation Failed.!!!", "FAILURE");
          });
        });


    });



  }
}
