import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';  
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { ForgotPasswordComponent } from './account/forgot-password.component';
import { ResetPasswordComponent } from './account/reset-password.component';
import { VerifyEmailComponent } from './account/verify-email.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule 
  ],
  providers: [],
})
export class AppModule {}
