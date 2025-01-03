import {AbstractControl} from "@angular/forms";

export function futureDateValidator(control: AbstractControl) {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today ? null : { pastDate: true };
}
