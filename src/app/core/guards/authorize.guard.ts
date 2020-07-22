import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentCredentials = this.authenticationService.currentCredentials;

    if (!currentCredentials) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const { permission } = currentCredentials.role;
    const hasPermission = this.checkPermission(permission, route.data.expectedPermission);
    if(!hasPermission) {
      eventEmitter.emit('authencation:error', true);
      this.router.navigate([currentCredentials.role.defaultUrl]);
    }

    return hasPermission;
  }

  private checkPermission(permission,roleOfPage) 
  {
     return permission.indexOf(roleOfPage) > -1
  }
}
