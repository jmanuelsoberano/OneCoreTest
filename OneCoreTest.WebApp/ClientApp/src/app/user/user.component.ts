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

  form = this.fb.group({
    id: [null],
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(7)]],
    passwordGroup: this.fb.group({
      password: ['', [
        Validators.required,
      ]],
      passwordRepeat: ['',
        Validators.required,
      ],
    }, { validators: passwordMatcher } ),
    status: [false, Validators.required],
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
    if (key !== 0) {
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
    const user = {
      email: this.form.get('email').value,
      name: this.form.get('name').value,
      password: this.form.get('passwordGroup').get('password').value,
      status: this.form.get('status').value,
      gender: this.form.get('gender').value
    }
    this.service.newUser(user).subscribe(() => this.router.navigateByUrl('/users-list'));
  }

}
