import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const usersKey = 'users';
let users = JSON.parse(localStorage.getItem(usersKey) || '[]');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/account/register') && method === 'POST':
                    return register();
                case url.endsWith('/account/login') && method === 'POST':
                    return authenticate();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        function register() {
            const user = body;

            if (users.find((x: any) => x.email === user.email)) {
                return error(`Email ${user.email} is already registered`);
            }

            // assign user id and a few other properties then save
            user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
            user.role = users.length === 0 ? 'Admin' : 'User';
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function authenticate() {
            const { email, password } = body;
            const user = users.find((x: any) => x.email === email && x.password === password);
            
            if (!user) return error('Email or password is incorrect');
            
            return ok({
                ...basicDetails(user),
                token: `fake-jwt-token.${user.id}`
            });
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown
        }

        function basicDetails(user: any) {
            const { id, title, firstName, lastName, email, role } = user;
            return { id, title, firstName, lastName, email, role };
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};

