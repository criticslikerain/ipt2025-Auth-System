import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { ForgotPasswordComponent } from './account/forgot-password.component';
import { ResetPasswordComponent } from './account/reset-password.component';
import { VerifyEmailComponent } from './account/verify-email.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: '**', redirectTo: '/login' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
