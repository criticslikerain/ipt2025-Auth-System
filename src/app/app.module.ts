import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app.component';

import { errorInterceptor } from './_helpers/error.interceptor';
import { jwtInterceptor } from './_helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withInterceptors([
      jwtInterceptor,
      errorInterceptor
    ]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
