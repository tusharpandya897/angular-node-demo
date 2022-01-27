import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { DeviceManagementApiService } from '../service/device-manaement-api/device-management-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login1.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: String = "";
  password: String = "";
  loginMessage: String = "";

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private devService: DeviceManagementApiService
  ) { }

  ngOnInit() {
  }

  validateUser() {
    let data = {};
    data["userName"] = this.userName;
    data["password"] = this.password;
    this.loginMessage = "";

    if (data["userName"].length == 0) {
      this.loginMessage = "Please enter an username";
    } else if (data["password"].length == 0) {
      this.loginMessage = "Please enter password";
    } else {
      this.spinner.show();
      this.apiService.login(data).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.statusCode == 200) {
            let userName = res.body.userName;
            localStorage.setItem('userData', JSON.stringify({ userRole: res.body.userRole, userEmail: res.body.email }));
            // this.apiService.setUserDetails({ userRole: res.body.userRole, userEmail: res.body.email })
            this.toastr.success('', 'Welcome to SSP');
            let token = res.body.token;
            localStorage.setItem('loggedInUserData', JSON.stringify(res.body));
            let payload = JSON.parse(atob((token || '').split('.')[1]));
            this.apiService.setToken(token);
            this.devService.setToken(token);
            this.apiService.changeUser(userName);
            localStorage.setItem("userName", userName);
            this.apiService.userRole = payload["custom:userRole"];
            this.router.navigate(['main']);
          } else {
            this.toastr.error('', res.body);
            this.loginMessage = res.body;
            this.password = "";
          }
        },
        (err) => {
          console.log('err :', err);
          this.spinner.hide();
          this.apiService.handleError(err, this.router);
        }
      );
    }
  }
}
