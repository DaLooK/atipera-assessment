import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function greaterThan(greaterThan: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormControl) {
      const value = Number(control.value);
      if (Number.isNaN(value) || value <= greaterThan) {
        return {
          greaterThan: true,
        };
      }
      return null;
    } else {
      return {
        greaterThan: true,
      };
    }
  };
}