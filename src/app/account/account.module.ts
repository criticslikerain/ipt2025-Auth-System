import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';
import { VerifyEmailComponent } from './verify-email.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AccountRoutingModule,
    // Import standalone components
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent
  ],
  declarations: [
    // Remove standalone components from declarations
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }