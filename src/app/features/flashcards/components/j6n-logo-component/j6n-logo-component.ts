import {Component, Input} from '@angular/core';

@Component({
  selector: 'j6n-logo',
  imports: [],
  templateUrl: './j6n-logo-component.html',
  styleUrl: './j6n-logo-component.scss',
})
export class J6nLogoComponent {
  @Input() color: string = '#4f46e5';
  @Input() size: string = '80px';
}
