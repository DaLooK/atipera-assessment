import { Component } from '@angular/core';
import { HelixLoaderComponent } from '../helix-loader/helix-loader.component';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [
    HelixLoaderComponent,
  ],
  template: `<app-helix-loader
          size="100"
          speed="1.5"
          color="var(--primary-color)"
  ></app-helix-loader>`,
  styles: `
    :host {
      display: grid;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgb(255 255 255 / 50%);
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }`
})
export class LoadingIndicatorComponent {

}
