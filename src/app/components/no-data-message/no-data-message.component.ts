import { Component } from '@angular/core';
import { HelixLoaderComponent } from '../helix-loader/helix-loader.component';

@Component({
  selector: 'app-no-data-message',
  standalone: true,
  imports: [],
  template: `
    <img src="undraw_empty_re_opql.svg"  alt="No results image">
    <h5>
        No results were found
    </h5>
  `,
  styles: `
    :host {
      text-align: center;
      padding: 2rem;
      gap: 1rem;
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    img {
      width: 50%;
      max-width: 30vmin;
      height: auto;
      max-height: 30vmin;
      object-fit: contain;
    }
  `
})
export class NoDataMessageComponent {

}
