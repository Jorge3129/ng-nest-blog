import {AbstractControl, ValidationErrors} from "@angular/forms";

export class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
    const regex = /\d/;

    if (regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return {passwordInvalid: true};
    }
  }

  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== null
      && confirmPassword !== null
      && password === confirmPassword
    ) {
      return null;
    } else {
      return {passwordsNotMatching: true};
    }
  }
}
