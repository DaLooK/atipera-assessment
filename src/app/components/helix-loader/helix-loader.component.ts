import { Component, computed, Input, signal } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-helix-loader',
  standalone: true,
  imports: [
    NgStyle,
  ],
  templateUrl: './helix-loader.component.html',
  styleUrl: './helix-loader.component.css',
})
export class HelixLoaderComponent {
  private loaderSize = signal(45);
  private loaderColor = signal('black');
  private loaderSpeed = signal(2.5);
  loaderParameters = computed(() => {
    const size = this.loaderSize();
    const color = this.loaderColor();
    const speed = this.loaderSpeed();
    return {
      '--uib-size': `${size}px`,
      '--uib-color': color,
      '--uib-speed': `${speed}s`,
    };
  });

  @Input() set size(value: number|string) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    this.loaderSize.set(value);
  }

  @Input() set color(value: string) {
    this.loaderColor.set(value);
  }

  @Input() set speed(value: number|string) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    this.loaderSpeed.set(value);
  }

}
