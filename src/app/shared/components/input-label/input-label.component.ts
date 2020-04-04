import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.less']
})
export class InputLabelComponent {
  @Input() label: string;
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'black' | 'white' = 'white';
}
