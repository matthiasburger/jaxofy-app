import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';

import {StoreModule} from '@ngrx/store';
import {MediaState} from './services/store/store';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorHandler} from '@angular/core';
import {AudioService} from './services/audio.service';
import {CloudService} from './services/cloud.service';
import {AuthenticationService} from './services/authentication.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      appState: MediaState.mediaStateReducer
    }),
    IonicModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy
  }, AudioService, CloudService, AuthenticationService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
