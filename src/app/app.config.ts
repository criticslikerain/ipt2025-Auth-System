import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { errorInterceptor } from './_helpers/error.interceptor';
import { jwtInterceptor } from './_helpers/jwt.interceptor';
import { fakeBackendInterceptor } from './_helpers/fake-backend';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([
            jwtInterceptor,
            errorInterceptor,
            fakeBackendInterceptor
        ])),
    ]
};





