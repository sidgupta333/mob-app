import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import { RestService } from 'src/app/services/rest.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login-custom',
  templateUrl: './login-custom.page.html',
  styleUrls: ['./login-custom.page.scss'],
})
export class LoginCustomPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private loading: LoadingController,
    private http: RestService,
    private dialogs: Dialogs,
    private authService: AuthenticationService) { }


  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

  }


  login() {

    // Create loader
    this.loading.create({
      message: 'Logging in',
      showBackdrop: true,
    }).then((loading) => {

      loading.present();
      let dto = {
        EMAIL: this.loginForm.value.email,
        PASSWORD: this.loginForm.value.password
      };

      // Call login service:
      this.http.loginUser(dto).subscribe((res) => {
        loading.dismiss();

        // Store login info in authentication service:
        this.authService.loginOthers(res);

      },
        err => {
          loading.dismiss();
          this.dialogs.alert("Your login credentials were incorrect", "Login Failed");
          this.loginForm.setValue({ email: '', password: '' });
        });
    });

    console.log(this.loginForm.value);
  }
}
