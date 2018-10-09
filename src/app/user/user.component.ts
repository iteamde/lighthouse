import { Component, OnInit } from '@angular/core';
import { AuthService } from '../@services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  invalidLogin: boolean;

  constructor(public auth: AuthService) {}

  async ngOnInit() {}

  signIn(credentials) {
    console.log('Logging in...');
    this.auth.emailLogin(credentials.email, credentials.password);
  }
}
