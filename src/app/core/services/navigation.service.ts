import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private isBackClicked = false;

  getBackClicked() {
    return this.isBackClicked;
  }

  setBackClicked(clicked: boolean) {
    this.isBackClicked = clicked;
  }
}
