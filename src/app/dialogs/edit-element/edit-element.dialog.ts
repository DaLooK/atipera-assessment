import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PeriodicElement } from '../../models/PeriodicElement';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as CustomValidators from '../../validators';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import lodash from 'lodash';

@Component({
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatError,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-element.dialog.html',
  styleUrl: './edit-element.dialog.scss',
})
export class EditElementDialog implements OnInit {
  elementForm = new FormGroup({
    'position': new FormControl(0, [Validators.required, Validators.min(1)]),
    'name': new FormControl('', Validators.required),
    'symbol': new FormControl('', Validators.required),
    'weight': new FormControl(0, [Validators.required, CustomValidators.greaterThan(0)]),
  });

  constructor(private dialogRef: MatDialogRef<EditElementDialog>,
              @Inject(MAT_DIALOG_DATA) public periodicElement: PeriodicElement) {
  }

  ngOnInit(): void {
    this.elementForm.setValue(lodash.pick(this.periodicElement, ['position', 'name', 'symbol', 'weight']));
  }

  cancelDialog() {
    this.dialogRef.close(null);
  }

  submitDialog() {
    if (this.elementForm.invalid) {
      return;
    }
    this.dialogRef.close(this.elementForm.value);
  }
}
