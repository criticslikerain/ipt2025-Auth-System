import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header with jwt if account is logged in and request is to the API URL
    const account = this.accountService.accountValue;
    const isLoggedIn = account && account.jwtToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl) {
      // Clone the request and set the Authorization header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${account.jwtToken}`
        }
      });
    }

    return next.handle(request);
  }
}
