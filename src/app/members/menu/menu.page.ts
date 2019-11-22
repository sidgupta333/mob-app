import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  isImageAvailable: boolean = false;
  name: string = null;
  imageUrl: string = "";

  constructor(private authService: AuthenticationService,
    private storage: Storage,
    private router: Router) { }

  ngOnInit() {

    //Fetch user details
    this.storage.ready().then(() => {
      this.storage.get('social').then((res: any) => {
        if (res == 'facebook') {
          this.isImageAvailable = true;

          this.storage.get('image').then((image: any) => {
            this.imageUrl = image;
          });

          this.storage.get('data').then((user: any) => {
            this.name = user.name;
          });
        }
        else {

          if (res == 'google') {
            this.isImageAvailable = true;
            
            this.storage.get('image').then((image: any) => {
              this.imageUrl = image;
            });
            
            this.storage.get('data').then((user: any) => {
              this.name = user.displayName;
            });
          }

          else {
            this.storage.get('data').then((user: any) => {
              this.name = user[0].NAME;
            });
          }

        }
      });
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateOrdersList() {
    this.router.navigate(['members', 'menu', 'my-orders']);
  }

  navigateToHome() {
    this.router.navigate(['members', 'menu', 'dashboard']);
  }

  navigateToAbout() {
    this.router.navigate(['members', 'menu', 'about-dev']);
  }


}
