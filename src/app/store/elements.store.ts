import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { PeriodicElement } from '../models/PeriodicElement';
import { computed, inject } from '@angular/core';
import { PeriodicTableService } from '../services/periodic-table.service';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

type ElementsState = {
  elements: PeriodicElement[];
  isLoading: boolean;
  filterQuery: string;
};

const initialState: ElementsState = {
  elements: [],
  isLoading: false,
  filterQuery: '',
};

export const ElementsStore = signalStore(
  withState(initialState),
  withComputed(({elements, filterQuery}) => ({
    filteredElements: computed(() => {
      const filterString = filterQuery();
      return elements().filter((element) =>
        element.name.includes(filterString) ||
        element.symbol.includes(filterString) ||
        element.position.toString().includes(filterString) ||
        element.weight.toString().includes(filterString),
      );
    }),
  })),
  withMethods((store, periodicTableService = inject(PeriodicTableService), snackBar = inject(MatSnackBar)) => ({
    updateFilterQuery(newQuery: string) {
      patchState(store, {filterQuery: newQuery});
    },
    loadElements() {
      patchState(store, {isLoading: true});
      periodicTableService.fetchElements().pipe(
        finalize(() => patchState(store, {isLoading: false})),
      ).subscribe((elements: PeriodicElement[]) => {
        patchState(store, {elements: elements});
      });
    },
    updateElement(position: number, element: Omit<PeriodicElement, 'position'>) {
      patchState(store, {isLoading: true});
      periodicTableService.updateElement(position, element).subscribe(
        (elementWasUpdatedCorrectly) => {
          if (elementWasUpdatedCorrectly) {
            snackBar.open('Element updated correctly');
          } else {
            snackBar.open('Element couldn\'t update correctly. Try again later.');
          }
          this.loadElements();
        });
    },
  })),
);
