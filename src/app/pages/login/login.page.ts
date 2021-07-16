import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginViewModel: LoginViewModel = {
    username: null,
    password: null
  };

  constructor(
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.loginViewModel).subscribe(
      async (res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Login failed',
          message: 'worked :)'
        });

        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 3000);

        await this.router.navigateByUrl('/tabs', {replaceUrl: true});
      },
      async (res) => {
        console.error(res);

        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }
}

export class LoginViewModel {
  username: string | null;
  password: string | null;
}
