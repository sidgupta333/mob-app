import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { RestService } from 'src/app/services/rest.service';


@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.page.html',
  styleUrls: ['./outlets.page.scss'],
})
export class OutletsPage implements OnInit {

  outlets: any[];
  tableAlloted: number = 0;
  tableNumber: any = null;
  outletId: any = null;
  outletinterval: any;

  constructor(private http: RestService,
    private dialogs: Dialogs,
    private loading: LoadingController,
    private storage: Storage,
    private router: Router) { }

  ngOnInit() {

    this.storage.ready().then(() => {

      this.storage.get('data').then((user: any) => {
        let id = null;

        this.storage.get("social").then((res2: any) => {

          if (res2 == 'facebook') {
            id = user.email;
          }
          else if (res2 == 'google') {
            id = user.email;
          }

          else {
            id = user[0].EMAIL;
          }

          this.http.getTableStatus(id).subscribe((res: any) => {
            if (res.message == 'No Data') {
              this.tableAlloted = 0;
            }
            else if (res.message == 'Waiting') {
              this.tableAlloted = 1;
            }

            else {
              this.tableAlloted = 2;
              this.tableNumber = res[0].TABLE_NUMBER;
              this.outletId = res[0].OUTLET_ID;
            }
          })


          // Fetch the status of table number
          this.outletinterval = window.setInterval(() => {

            this.http.getTableStatus(id).subscribe((res: any) => {
              if (res.message == 'No Data') {
                this.tableAlloted = 0;
              }
              else if (res.message == 'Waiting') {
                this.tableAlloted = 1;
              }

              else {
                this.tableAlloted = 2;
                this.tableNumber = res[0].TABLE_NUMBER;
                this.outletId = res[0].OUTLET_ID;
              }
            },
            err => {
              this.tableAlloted = 0;
            })

          }, 5000);


        });
      });
    });

    //Get outlet lists from Server:
    this.loading.create({
      message: 'Getting outlets list',
      showBackdrop: true,
    }).then(loading => {

      loading.present();

      this.http.getOutlets().subscribe((res: any[]) => {
        loading.dismiss();
        this.outlets = res;
      },

        err => {
          loading.dismiss();
          this.dialogs.alert("Unable to connect to server, please check your connection.", "Connection failed");
        });
    });


    // Remove all the saved data regarding order in storage:
    this.storage.remove('Mixtures');
    this.storage.remove('PCount');
    this.storage.remove('Drink');
    this.storage.remove('outlet');
    this.storage.remove('TCount');

  }



  selectOutlet(outlet: any) {

    if (this.tableAlloted == 0) {
      this.dialogs.alert("You are not yet alloted any table, please reach out to Restuarant personnel.", "PLEASE WAIT");
    }
    else if (this.tableAlloted == 1) {
      this.dialogs.alert("You are in waiting queue, please wait.", "PLEASE WAIT");
    }
    else {

      //Check if selected outlet is correct or not:

      if (outlet._id == this.outletId) {
        console.log("Outlet selected: ", outlet);
        this.storage.set("outlet", outlet);
        window.clearInterval(this.outletinterval);
        
        //Save table number:
        this.storage.set("table", this.tableNumber);
        this.router.navigate(['members', 'menu', 'dashboard']);

      }

      else {
        this.dialogs.alert("Please select outlet in which your seat is booked.", "ERROR");

      }

    }
  }



}
