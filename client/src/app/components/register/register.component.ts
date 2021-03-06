import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {CustomValidators} from "./custom-validators";
import {map} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
        name: [null, [Validators.required]],
        username: [null, [Validators.required]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.minLength(6)
        ]],
        password: [null, [
          Validators.required,
          Validators.minLength(3),
          CustomValidators.passwordContainsNumber
        ]],
        confirmPassword: [null, [Validators.required]]
      },
      {
        validators: CustomValidators.passwordsMatch
      })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.registerForm.invalid) return;
    //console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).pipe(
      map(user => this.router.navigate(['login']))
    ).subscribe()
  }

}
