import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";
import {NgStyle} from "@angular/common";
import {TaskResponse} from "../../models/TaskResponse";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatIcon,
    MatCard,
    NgStyle
  ],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.css'
})
export class DeleteTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  taskService = inject(TaskService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {task: TaskResponse}) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.taskService.deleteTask(this.data.task.id).subscribe({
      next: (res: void) => {
        this.dialogRef.close(true);
      },
      error: err => {
        console.error(err);
        this.dialogRef.close();
      }
    })
  }

}
