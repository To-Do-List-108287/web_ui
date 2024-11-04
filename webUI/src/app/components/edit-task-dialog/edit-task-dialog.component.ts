import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {TaskResponse} from "../../models/TaskResponse";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TaskService} from "../../services/task.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {futureDateValidator} from "../../validators/futureDateValidator";
import {TaskPriority} from "../../models/TaskPriority";
import {CreateTaskRequest} from "../../models/CreateTaskRequest";

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.css'
})
export class EditTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly _snackBar = inject(MatSnackBar);
  taskService = inject(TaskService);
  editTaskFormGroup: FormGroup;
  originalTaskValues: { };
  priorities= [
    {value: TaskPriority.HIGH, viewValue: 'High'},
    {value: TaskPriority.MEDIUM, viewValue: 'Medium'},
    {value: TaskPriority.LOW, viewValue: 'Low'},
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {task: TaskResponse}) {
    let deadline: Date = new Date(this.data.task.deadline)
    this.originalTaskValues = {
      title: this.data.task.title,
      description: this.data.task.description,
      deadline: deadline,
      priority: this.data.task.priority,
    };

    this.editTaskFormGroup = new FormGroup({
      title: new FormControl(this.data.task.title, Validators.required),
      description: new FormControl(this.data.task.description, Validators.required),
      deadline: new FormControl(deadline, [Validators.required, futureDateValidator]),
      priority: new FormControl(this.data.task.priority, Validators.required),
    })
  }


  onConfirmClick(): void {
    if (this.editTaskFormGroup.valid) {
      const editedTask = this.editTaskFormGroup.value as CreateTaskRequest;
      const changedFields: Partial<CreateTaskRequest> = this.getChangedFields(this.originalTaskValues, editedTask);
      const hasNonOptionalValue = Object.keys(changedFields).some(
        key => changedFields[key as keyof CreateTaskRequest] !== undefined
      );
      if (!hasNonOptionalValue) {
        this._snackBar.open('No changes detected!', 'Close', {
          duration: 2000,
          panelClass: ['warning_snackbar']
        });
        return;
      }
      this.taskService.editTask(this.data.task.id, changedFields).subscribe({
        next: (task: TaskResponse) => {
          this.dialogRef.close(task);
          this._snackBar.open('Task edited successfully!', 'Close', {
            duration: 2000,
            panelClass: ['primary_snackbar']
          });

        },
        error: (error) => {
          console.error(error)
          this.dialogRef.close();
          this._snackBar.open('Error updating task. Try again later!', 'Close', {
            duration: 2000,
            panelClass: ['warning_snackbar']
          });
        }
      });
    }
  }

  getChangedFields(original: Partial<CreateTaskRequest>, edited: CreateTaskRequest): Partial<CreateTaskRequest> {
    const changedFields: Partial<CreateTaskRequest> = {};

    for (const key in original) {
      if (original.hasOwnProperty(key)) {
        // @ts-ignore
        if (original[key] instanceof Date) {
          // @ts-ignore
          if (original[key].getTime() !== edited[key].getTime()) {
            changedFields[key as keyof CreateTaskRequest] = edited[key as keyof CreateTaskRequest];
          }
          // @ts-ignore
        } else if (original[key] !== edited[key]) {
          changedFields[key as keyof CreateTaskRequest] = edited[key as keyof CreateTaskRequest];
        }
      }

    }

    return changedFields;
  }

}
