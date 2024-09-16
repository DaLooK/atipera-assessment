import { Component, computed, inject, ViewChild } from '@angular/core';
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
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import {
  debounceTime,
  distinctUntilChanged,
  endWith,
  lastValueFrom,
  map,
  mergeMap,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { rxState, RxState } from '@rx-angular/state';
import { ElementsState } from '../../store/elements-state';
import { PeriodicTableService } from '../../services/periodic-table.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  providers: [RxState],
})
export class HomeComponent {
  @ViewChild('elementsTable') elementsTable?: MatTable<PeriodicElement>;

  readonly updateElement$ = new Subject<{ id: number, element: PeriodicElement }>();

  readonly filterFormControl = new FormControl('');
  readonly matDialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly periodicTableService = inject(PeriodicTableService);
  readonly elementsStore = rxState<ElementsState>(({set, connect}) => {
    set({
      elements: [],
      isLoading: false,
      filterQuery: '',
    });

    connect(this.periodicTableService.fetchElements().pipe(
      map((elements) => ({elements})),
      startWith({isLoading: true}),
      endWith({isLoading: false}),
    ));
    connect('filterQuery', this.filterFormControl.valueChanges.pipe(
      debounceTime(2000),
      map((value) => value ?? ''),
      distinctUntilChanged(),
    ));
    connect(this.updateElement$.pipe(
      mergeMap(({id, element}) =>
        this.periodicTableService.updateElement(id, element).pipe(
          tap((elementWasUpdatedCorrectly) => {
            if (elementWasUpdatedCorrectly) {
              this.snackBar.open('Element updated correctly');
            } else {
              this.snackBar.open('Element couldn\'t update correctly. Try again later.');
            }
          }),
          mergeMap(() => this.periodicTableService.fetchElements()),
          map((elements) => ({elements})),
          startWith({isLoading: true}),
          endWith({isLoading: false}),
        ),
      ),
    ));
  });
  readonly isLoading = this.elementsStore.signal('isLoading');
  readonly filteredElements = this.elementsStore.computed<PeriodicElement[]>(({elements, filterQuery}) => {
    const filterString = filterQuery().trim().toLowerCase();
    if (!filterString) {
      return elements();
    }
    return elements().filter((element) =>
      element.name.toLowerCase().includes(filterString) ||
      element.symbol.toLowerCase().includes(filterString) ||
      element.position.toString().includes(filterString) ||
      element.weight.toString().includes(filterString),
    );
  });
  readonly emptyResults = computed<boolean>(() => {
    // Comment if we want to display even before first load
    // const isLoading = this.isLoading();
    /* if (isLoading) {
      return false;
    } */
    return !this.filteredElements().length;
  });

  readonly columnsToDisplay: (keyof PeriodicElement | 'actions')[] = [
    'position',
    'name',
    'symbol',
    'weight',
    'actions',
  ];

  openEditDialog(element: PeriodicElement) {
    if (element.id === undefined) {
      return;
    }
    const dialogRef = this.matDialog.open(EditElementDialog, {
      data: element,
    });
    lastValueFrom(dialogRef.afterClosed()).then((newElementDetails) => {
      if (newElementDetails) {
        this.updateElement$.next({
          id: element.id!,
          element: newElementDetails,
        });
      }
    });
  }
}
