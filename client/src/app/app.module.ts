import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpotifyInfoModule } from './spotify-info/spotify-info.module';

// Components
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { JwtInterceptor } from './services/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SpotifyInfoModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
