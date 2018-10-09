import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from '../../objects/address';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../@services/auth.service';
import { PasswordValidation } from '../../password-validation';
import { UserService } from '../../@services/user.service';
import { MatStepper } from '../../../../node_modules/@angular/material';
import { AddressService } from '../../@services/address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../@services/project.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy, OnInit {
  companyChecked = false;
  studentChecked = false;

  type;
  emailProviders;

  loading = false;
  disabled = false;

  passwordFormGroup: FormGroup;
  loginDetailsGroup: FormGroup;

  personalDetailsGroup: FormGroup;
  signUpDetailsGroup: FormGroup;

  fragment;

  phoneExpression = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;

  @ViewChild('places')
  places: GooglePlaceDirective;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public addressService: AddressService,
    public userService: UserService,
    private projectService: ProjectService,
    private router: Router,
    public auth: AuthService
  ) {
    this.passwordFormGroup = this._formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: RegistrationValidator.validate.bind(this)
      }
    );

    this.loginDetailsGroup = this._formBuilder.group({
      email: ['', Validators.email],
      phone: ['', Validators.pattern(this.phoneExpression)],
      passwordFormGroup: this.passwordFormGroup
    });
  }

  ngOnInit() {
    this.fragment = this.route.snapshot.fragment; // only update on component creation
    if (this.fragment === 'googleSignup') {
      this.type = 'google';
    }
    this.signUpDetailsGroup = this.userService.signUpDetails;
  }

  ngOnDestroy() {
    this.signUpDetailsGroup.reset;
  }

  signUp(stepper: MatStepper) {
    this.loading = true;

    console.log(this.type);
    if (this.type === 'google') {
      this.userSignUp(this.auth.authState, stepper);
    } else {
      this.auth
        .emailSignUp(
          this.loginDetailsGroup.value.email,
          this.passwordFormGroup.value.password
        )
        .then(data => {
          console.log('Sign up success... Syncing to User database');

          console.log('[IsThisYouData] ', this.userService.isThisYouData);

          console.log('[SignUp Data]', data);

          this.userSignUp(this.auth.authState.user, stepper);
        })
        .catch(error => console.log(error));
    }
  }

  userSignUp(user, stepper) {
    this.userService.signUpDetails.patchValue({
      currentProject: this.projectService.projectItem
    });

    this.userService
      .newUser(user, this.userService.signUpDetails.value)
      .subscribe(
        data => {
          this.signUpDetailsGroup.reset();
          console.log('SUCCESS [User] ', data);
          this.auth.firstUserData().then(data => {
            (this.auth.userDetails = data),
              console.log('[Auth]', this.auth.userDetails),
              (this.loading = false);
            this.router.navigate(['/signup/success']);
          });
        },
        error => {
          this.loading = false;
          this.userService.deleteUser();
          console.log('ERROR [User]', error);
        }
      );
  }

  checkIfUserExists(email, phone, stepper: MatStepper) {
    this.loading = true;

    this.userService.checkUser(email, phone).subscribe(data => {
      console.log('[Is This You?] ' + data);

      this.userService.isThisYou(data);

      if (data === false) {
        this.userService.startNewSignUp(email, phone);
        console.log('yes its false');
      }

      this.loading = false;
      console.log(this.loading);

      stepper.next();
      console.log('nexted');
    });
  }

  clear() {
    this.loginDetailsGroup.get('email').setValidators([]);
    this.loginDetailsGroup.get('phone').setValidators([]);
    this.passwordFormGroup.get('password').setValidators([]);
    this.passwordFormGroup.get('confirmPassword').setValidators([]);
    this.passwordFormGroup.setValidators([]);
    this.passwordFormGroup.get('password').updateValueAndValidity();
    this.passwordFormGroup.get('confirmPassword').updateValueAndValidity();

    this.disabled = true;
    console.log(this.passwordFormGroup.controls);

    console.log(this.loginDetailsGroup.valid);
  }

  googleSignUp(stepper) {
    this.type = 'google';
    console.log(this.type);
    this.userService.isThisYouData = false;

    this.auth
      .googleLogin()
      .then(data => {
        console.log(data);

        this.clear();

        this.loading = true;

        const authData = data['user'];
        const authDataProfile = data['additionalUserInfo'].profile;

        this.loginDetailsGroup.patchValue({
          email: authData.email,
          phone: authData.phone
        });

        this.userService.startNewSignUp(authData.email, authData.phone);

        this.userService.signUpDetails.patchValue({
          email: authData.email,
          phoneNumber: authData.phoneNumber
        });

        this.userService.signUpDetails.patchValue({
          firstName: authDataProfile.given_name,
          lastName: authDataProfile.family_name
        });

        this.loading = false;
        console.log(this.loading);
        stepper.next();
      })
      .catch();

    console.log('Sign up');
  }

  checkIfEmailExists(email) {
    this.emailProviders = '';

    const providersExist = this.auth
      .emailAlreadyExists(email)
      .then(data => (this.emailProviders = data));
  }

  // Address change methods

  personalAddressChange(address: Address) {
    const parsedAddress = this.addressService.parseAddress(address);

    this.userService.signUpDetails.patchValue({
      addressStreet1: parsedAddress.street1,
      addressCity: parsedAddress.city,
      addressState: parsedAddress.state,
      addressCountry: parsedAddress.country,
      addressPostalCode: parsedAddress.postalCode
    });

    console.log('[Address] ', parsedAddress);
  }

  companyAddressChange(address: Address) {
    const parsedAddress = this.addressService.parseAddress(address);

    this.userService.signUpDetails.patchValue({
      companyAddressStreet1: parsedAddress.street1,
      companyAddressCity: parsedAddress.city,
      companyAddressState: parsedAddress.state,
      companyAddressCountry: parsedAddress.country,
      companyAddressPostalCode: parsedAddress.postalCode
    });

    console.log('[Address] ', parsedAddress);
  }

  public changeConfig() {
    this.places.reset();
  }
}

export class RegistrationValidator {
  static validate(registrationFormGroup: FormGroup) {
    const password = registrationFormGroup.controls.password.value;
    const confirmPassword =
      registrationFormGroup.controls.confirmPassword.value;

    if (confirmPassword.length <= 0) {
      return null;
    }

    if (confirmPassword !== password) {
      return {
        doesMatchPassword: true
      };
    }

    return null;
  }
}
