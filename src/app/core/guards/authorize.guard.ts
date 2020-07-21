import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/core/services';

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentCredentials = this.authenticationService.currentCredentials;

    if (!currentCredentials) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const { permission } = currentCredentials.role;
    const expectedPermission = route.data.expectedPermission;

    if (permission.indexOf(expectedPermission) === -1) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
