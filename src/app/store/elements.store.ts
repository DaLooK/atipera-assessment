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
  withComputed(({elements, filterQuery, isLoading}) => ({
    filteredElements: computed<PeriodicElement[]>(() => {
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
    updateElement(id: number, element: Omit<PeriodicElement, 'id'>) {
      patchState(store, {isLoading: true});
      periodicTableService.updateElement(id, element).subscribe(
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
