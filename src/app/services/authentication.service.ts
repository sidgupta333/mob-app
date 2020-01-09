import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { HttpClient } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { RestService } from './rest.service';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userID = null;
  authToken = null;
  imageUrl = null;
  user: Observable<firebase.User>;

  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage,
    private plt: Platform, private fb: Facebook,
    private google: GooglePlus, private http: HttpClient,
    private rest: RestService,
    private dialog: Dialogs,
    private fireAuth: AngularFireAuth) {

    this.plt.ready().then(() => {
      this.checkToken();
    });

    this.user = this.fireAuth.authState;
  }


  // Post opening of app, check for token if already exists
  private checkToken() {

    this.storage.get("token").then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  loginOthers(data: object) {
    this.storage.set("token", "Others-token");
    this.storage.set("data", data);
    this.storage.set("social", "others");
    this.authenticationState.next(true);
  }

  logout() {
    return this.storage.remove("token").then(() => {
      this.storage.remove("data").then(() => {
        this.storage.remove("social").then(() => {
          this.authenticationState.next(false);
        })
      });
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }


  // Login code using Facebook

  loginFb() {
    this.fb.login(['public_profile', 'email'])

      .then((res: FacebookLoginResponse) => {
        console.log("Succes: ", res);
        if (res.status == 'connected') {

          this.userID = res.authResponse.userID;
          this.authToken = res.authResponse.accessToken;

          this.getFBData(this.userID, this.authToken);

          console.log('Image id: ', 'https://graph.facebook.com/' + res.authResponse.userID + '/picture?type=square');

          this.imageUrl = 'https://graph.facebook.com/' + res.authResponse.userID + '/picture?type=square';

          this.storage.set("image", this.imageUrl);
          console.log('Logged into Facebook!', res);

        }
        // tslint:disable-next-line: one-line
        else {
          alert('Login failed');
        }

      })
      .catch(e => console.log('Error logging into Facebook', e));

  }

  // Use auth token given by facebook to get details of user:
  getFBData(userID: string, access_token: string) {
    let url = "https://graph.facebook.com/" + userID + "?fields=id,name,email&access_token=" + access_token;

    const credential = firebase.auth.FacebookAuthProvider.credential(access_token);
    this.fireAuth.auth.signInWithCredential(credential).then((response) => {
      console.log("Firebase response --> ", response);
    })

    this.http.get(url).subscribe((data: any) => {

      console.log("FB data --> ", data);


      let dto = {
        NAME: data.name,
        EMAIL: data.email,
        USER_ID: null,
        USER_TYPE: 'USER',
        SOURCE: 'F',
        PASSWORD: 'default'
      };

      this.rest.registerUser(dto).subscribe((res) => {

        // Store details in the storage received from facebook
        this.storage.set("token", access_token);
        this.storage.set("data", data);
        this.storage.set("social", "facebook");
        this.authenticationState.next(true);

      },
        err => {
          this.dialog.alert("Login failed", "ERROR");
        });


    });

  }


  loginGoogle() {


    this.google.login({})
      .then(res => {

        let dto = {
          NAME: res.displayName,
          EMAIL: res.email,
          USER_ID: null,
          USER_TYPE: 'USER',
          SOURCE: 'G',
          PASSWORD: 'default'
        };

        this.rest.registerUser(dto).subscribe((r) => {

          console.log("Google data --> ", res);
          this.storage.set("token", res.accessToken);
          this.storage.set("data", res);
          this.storage.set("image", res.imageUrl);
          this.storage.set("social", "google");

          this.authenticationState.next(true);

        },
          err => {
            this.dialog.alert("Login failed", "ERROR");
          });



        this.authenticationState.next(true);

      })
      .catch(err => console.error(err));
  }

}


