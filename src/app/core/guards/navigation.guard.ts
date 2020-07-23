import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { NavigationService } from '@app/core/services';

@Injectable({ providedIn: 'root' })
export class NavigationGuard implements CanDeactivate<any> {
  constructor(private navigationService: NavigationService) {}

  canDeactivate(component: any) {
    if (this.navigationService.getBackClicked()) {
      this.navigationService.setBackClicked(false);

      history.pushState(null, null, location.href);

      return false;
    }

    return true;
  }
}
