import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login.service';
import { PartialObserver } from 'rxjs';
import { User } from '../models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  // Form Group
  loginFg: FormGroup;

  // Hide for password
  hidePwd = true;

  // Return url
  returnUrl: string;

  // Load Status
  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private _formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe(queryParams => {
      this.returnUrl = queryParams['returnUrl'];
    });
  }

  ngOnInit() {
    // Route away if logged in
    if (this.loginService.currentUserValue) {
      this.router.navigate(['/home']);
    } else {
      this.loginFg = this._formBuilder.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });

      // Reset login status
      this.loginService.logout();

      // Get url from route parameters or default to home
      this.returnUrl = this.returnUrl || '/';

      this.loadStatus.isLoaded = true;
    }
  }

  public login() {
    this.loadStatus.isLoaded = false;
    const userName = this.loginFg.controls.userName.value;
    const password = this.loginFg.controls.password.value;
    this.loginService.login(userName, password).subscribe(this.loginSub());
  }

  private loginSub(): PartialObserver<any> {
    return {
      next: (data: User) => {
        if (!data.status) {
          this.loadStatus.isError = true;
          this.loadStatus.errorMsg = data.error;
        } else {
          // Route to new component
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.log(err);
        this.loadStatus.isError = true;
        this.loadStatus.errorMsg = 'Something went wrong';
      },
      complete: () => {
        this.loadStatus.isLoaded = true;
      }
    };
  }

}
