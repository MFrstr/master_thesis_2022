import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

import { AuthService } from '@app/shared/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  passwordsMatchValidator(control: FormControl): ValidationErrors | null {
    const password = control.root.get('password');
    return password && control.value !== password.value
      ? {
          passwordMatch: true,
        }
      : null;
  }

  formIsInvalid: boolean = false;

  mailPattern: RegExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  userForm = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.mailPattern),
    ]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [
      Validators.required,
      this.passwordsMatchValidator,
    ]),
    roles: new FormControl('user'),
    // set default role as user in user.model
    // so each account has at least the role user
  });

  get fullname(): AbstractControl {
    return this.userForm.get('fullname')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.userForm.get('password')!;
  }

  get repeatPassword(): AbstractControl {
    return this.userForm.get('repeatPassword')!;
  }

  get roles(): AbstractControl {
    return this.userForm.get('roles')!;
  }

  register(): void {
    if (this.userForm.invalid) {
      this.formIsInvalid = true;
      return;
    }

    const { fullname, email, password, repeatPassword, roles } =
      this.userForm.getRawValue();

    this.authService
      .register(fullname, email, password, repeatPassword, roles)
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
