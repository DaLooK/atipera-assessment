import { Component, inject, OnInit } from '@angular/core';
import { ElementsStore } from '../../store/elements.store';
import { JsonPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, MatToolbar, MatSlideToggle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly elementsStore = inject(ElementsStore);

  ngOnInit(): void {
    this.elementsStore.loadElements();
  }



}
