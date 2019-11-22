import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';


import { RestService } from 'src/app/services/rest.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  isInvalid: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private loading: LoadingController,
    private http: RestService,
    private dialogs: Dialogs,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      cPassword: ['']
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let cPass = group.get('cPassword').value;
    return pass === cPass ? null : "error"
  }

  passwordChanged() {

    let pass = this.registerForm.get('password').value;
    let cPass = this.registerForm.get('cPassword').value;

    if (pass.length > 0 && cPass.length > 0) {

      if (pass === cPass) {
        this.isInvalid = false;
      }
      else {
        this.isInvalid = true;
      }

    }
  }

  registerUser() {

    // Create loader
    this.loading.create({
      message: 'Registering User',
      showBackdrop: true,
    }).then((loading) => {

      loading.present();
      let dto = {
        NAME: this.registerForm.value.name,
        EMAIL: this.registerForm.value.email,
        USER_ID: null,
        USER_TYPE: 'USER',
        SOURCE: 'E',
        PASSWORD: this.registerForm.value.password
      };

      // Call User registration service
      this.http.registerUser(dto).subscribe((res: any) => {

        loading.dismiss();
        if(res.message == 'Success') {
          this.dialogs.alert("Users registered successfully.", "Registration Successful")
          .then(() => this.router.navigate(['login-custom']));

        }
        else {
          this.dialogs.alert("User with this email id already exists, Please Login", "Duplicate User")
          .then(() => this.router.navigate(['login-custom']));

        }
        
        
      },

      err => {
        this.dialogs.alert("Please contact Admin", "Registration Failed");
        this.registerForm.setValue({name: '', email: '', password: '', cPassword: ''});
      });

    });
  }


  clearForm() {
    this.registerForm.setValue({name: '', email: '', password: '', cPassword: ''});
    this.isInvalid = false;    
  }

}
