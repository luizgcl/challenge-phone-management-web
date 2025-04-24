import { Component, input } from '@angular/core';

export type LogoVariant = 'colored' | 'black';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css',
})
export class LogoComponent {
  variant = input.required<LogoVariant>();
}
