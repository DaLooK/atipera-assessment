import { Injectable } from '@angular/core';
import { ELEMENT_DATA } from '../mocks/periodic-table.mock';
import { delay, Observable, of } from 'rxjs';
import { PeriodicElement } from '../models/PeriodicElement';
import lodash from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PeriodicTableService {
  private fakeElementsInServer = ELEMENT_DATA;

  constructor() {
  }

  fetchElements(): Observable<PeriodicElement[]> {
    return of(lodash.cloneDeep(this.fakeElementsInServer)).pipe(delay(3000));
  }

  updateElement(position: number, element: Omit<PeriodicElement, 'position'>): Observable<boolean> {
    const elementToUpdate: PeriodicElement | undefined = this.fakeElementsInServer.find((element) => element.position === position);
    if (elementToUpdate) {
      Object.assign(elementToUpdate, lodash.omit(element, 'position'));
    }
    return of(!!elementToUpdate).pipe(delay(1000));
  }
}
