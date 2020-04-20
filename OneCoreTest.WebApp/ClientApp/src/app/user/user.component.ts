import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../users/user.service';
import { pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const passwordControl = c.get('password');
  const repeatControl = c.get('passwordRepeat');

  if (passwordControl.pristine || repeatControl.pristine) {
    return null;
  }

  if (passwordControl.value === repeatControl.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isNew = true;
  errorMessage = undefined;

  form = this.fb.group({
    id: [null],
    email: ['', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,}$')
    ]],
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-z0-9]{7,}$')
    ]],
    passwordGroup: this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9$@$!%*?&]{10,}$')
      ]],
      passwordRepeat: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9$@$!%*?&]{10,}$')
      ]],
    }, { validators: passwordMatcher } ),
    status: [true, Validators.required],
    gender: [null, Validators.required],
    creationDate: [null],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const key = this.route.snapshot.params.id;
    this.isNew = key === undefined;
    if (!this.isNew) {
      this.form.get('status').disable();
      this.service.getUser(key)
        .pipe(
          map((m: any) => ({
            id: m.id,
            email: m.email,
            name: m.name,
              passwordGroup: {
                password: m.password,
                passwordRepeat: m.password
            },
            status: m.status,
            gender: m.gender,
            creationDate: m.creationDate,
          }))
        )
        .subscribe(next => this.form.patchValue(next))
    }
  }

  onSubmit() {
    this.errorMessage = undefined;
    const user = {
      email: this.form.get('email').value,
      name: this.form.get('name').value,
      password: this.form.get('passwordGroup').get('password').value,
      status: this.form.get('status').value,
      gender: this.form.get('gender').value
    }
    if (this.isNew) {
      this.service.newUser(user)
        .subscribe(
          next => this.router.navigateByUrl('/users-list'),
          error => this.errorMessage = error
        );
    } else {
      let userClone = Object.assign(user, { id: this.form.get('id').value})
      this.service.updateUser(userClone)
        .subscribe(
          next => this.router.navigateByUrl('/users-list'),
          error => this.errorMessage = error
        );
    }
  }


}
