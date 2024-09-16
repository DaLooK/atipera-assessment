import { PeriodicElement } from '../models/PeriodicElement';

export interface ElementsState {
  elements: PeriodicElement[];
  isLoading: boolean;
  filterQuery: string;
}