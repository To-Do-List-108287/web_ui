import {Component, inject} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatOption, MatSelect} from "@angular/material/select";
import {TaskPriority} from "../../models/TaskPriority";
import {TaskService} from "../../services/task.service";
import {futureDateValidator} from "../../validators/futureDateValidator";
import {TaskResponse} from "../../models/TaskResponse";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FormsModule,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  providers: [],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly _snackBar = inject(MatSnackBar);

  taskService = inject(TaskService);
  createTaskFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', [Validators.required, Validators.maxLength(16)]),
    deadline: new FormControl('', [Validators.required, futureDateValidator]),
    priority: new FormControl('', Validators.required),
  });
  priorities= [
    {value: TaskPriority.HIGH, viewValue: 'High'},
    {value: TaskPriority.MEDIUM, viewValue: 'Medium'},
    {value: TaskPriority.LOW, viewValue: 'Low'},
  ];

  constructor() { }

  onConfirmClick(): void {
    if (this.createTaskFormGroup.valid) {
      this.taskService.createTask({
        title: this.createTaskFormGroup.get('title')?.value,
        description: this.createTaskFormGroup.get('description')?.value,
        category: this.createTaskFormGroup.get('category')?.value,
        deadline: this.createTaskFormGroup.get('deadline')?.value,
        priority: this.createTaskFormGroup.get('priority')?.value
      }).subscribe({
        next: (res: TaskResponse) => {
          this.dialogRef.close(res);
          this._snackBar.open("Task created successfully!", "Close", {
            duration: 2000,
            panelClass: ['primary_snackbar']
          });
        },
        error: err => {
          console.error(err);
          this.dialogRef.close();
          this._snackBar.open("Error creating task. Try again later!", "Close", {
            duration: 2000,
            panelClass: ['warning_snackbar']
          });
        }
      })

    } else {
      console.error("Invalid form data");
    }
  }

  protected readonly console = console;
}
