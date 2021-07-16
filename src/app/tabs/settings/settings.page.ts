import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
