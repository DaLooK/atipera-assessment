import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { ElementsStore } from '../../store/elements.store';
import { JsonPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { HelixLoaderComponent } from '../../components/helix-loader/helix-loader.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTextColumn,
} from '@angular/material/table';
import { PeriodicElement } from '../../models/PeriodicElement';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import { debounceTime, take } from 'rxjs';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe,
    MatToolbar,
    MatSlideToggle,
    HelixLoaderComponent,
    MatTable,
    MatTextColumn,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    LoadingIndicatorComponent,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle, MatInput, MatFormField,
    MatLabel, ReactiveFormsModule, MatIconButton, MatIcon, NoDataMessageComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('elementsTable') elementsTable?: MatTable<PeriodicElement>;

  readonly matDialog = inject(MatDialog);
  readonly elementsStore = inject(ElementsStore);
  readonly columnsToDisplay: (keyof PeriodicElement | 'actions')[] = [
    'position',
    'name',
    'symbol',
    'weight',
    'actions',
  ];

  readonly filterFormControl = new FormControl(this.elementsStore.filterQuery());

  readonly emptyResults = computed<boolean>(() => {
    // Comment if want to display even before first load
    /* if (this.elementsStore.isLoading()) {
      return false;
    } */
    return !this.elementsStore.filteredElements().length;
  });

  constructor() {
    this.filterFormControl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(2000),
    ).subscribe((newFilterQueryValue) => {
      this.elementsStore.updateFilterQuery(newFilterQueryValue ?? '');
    });
  }

  ngOnInit(): void {
    this.elementsStore.loadElements();
  }


  openEditDialog(element: PeriodicElement) {
    if (element.id === undefined) {
      return;
    }
    const dialogRef = this.matDialog.open(EditElementDialog, {
      data: element,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((newElementDetails) => {
      if (newElementDetails) {
        this.elementsStore.updateElement(element.id!, newElementDetails);
      }
    });
  }
}
