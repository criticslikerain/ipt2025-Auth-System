import { UntypedFormGroup } from '@angular/forms';

// Custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // Return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    // Check if the values don't match
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null); // Clear the error if values match
    }
  };
}
