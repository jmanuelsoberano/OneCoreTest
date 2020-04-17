import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { User } from '../users/user.model';
import { UserAuth } from '../models/user-auth';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  securityObject: UserAuth = null;
  returnUrl = '/users-list';
  errorMessage = undefined;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private service: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.errorMessage = undefined;
    this.service.login(this.form.value).subscribe(
      resp => {
        this.securityObject = resp;
        this.router.navigateByUrl(this.returnUrl);
      },
      error => this.errorMessage = error
    )
  }

}
