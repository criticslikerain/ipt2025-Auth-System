import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

// Services
import { AuthService } from './_services/auth.service';
import { AlertService } from './_services/alert.service';
import { AccountService } from './_services/account.service';

// Interceptors
import { jwtInterceptor } from './_helpers/jwt.interceptor';
import { errorInterceptor } from './_helpers/error.interceptor';
import { fakeBackendInterceptor } from './_helpers/fake-backend';

// Components
import { AlertComponent } from './_components/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: errorInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: fakeBackendInterceptor, multi: true },
        AuthService,
        AlertService,
        AccountService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
