import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { errorInterceptor } from './_helpers/error.interceptor';
import { jwtInterceptor } from './_helpers/jwt.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([
            jwtInterceptor,
            errorInterceptor
        ])),
        provideAnimations()
    ]
};








