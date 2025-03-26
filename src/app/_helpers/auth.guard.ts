import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const account = this.accountService.accountValue;

    // Check if the user is logged in
    if (account) {
      // Check if the route is restricted by role
      if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
        // Role is not authorized, so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // User is logged in and has the right role, so allow access
      return true;
    }

    // User is not logged in, so redirect to login page with the return URL
    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
