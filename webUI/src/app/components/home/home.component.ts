import {Component, inject} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatCard} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {TaskResponse} from "../../models/TaskResponse";
import {MatIcon} from "@angular/material/icon";
import {TaskPriority} from "../../models/TaskPriority";
import {MatMiniFabButton} from "@angular/material/button";
import {NgStyle} from "@angular/common";
import {DeleteTaskDialogComponent} from "../delete-task-dialog/delete-task-dialog.component";
import {TaskCompletionStatus} from "../../models/TaskCompletionStatus";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatCard, MatIcon, MatMiniFabButton, NgStyle
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  todoTasks: TaskResponse[] = [];
  inProgressTasks: TaskResponse[] = [];
  doneTasks: TaskResponse[] = [];

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      height: '523px',
      width: '523px',
    });
    dialogRef.afterClosed().subscribe({
      next: (task: TaskResponse) => {
        if (task) {
          this.todoTasks.push(task);
        }
      }
    });
  }

  openDeleteDialog(taskToDelete: TaskResponse, taskList: TaskResponse[]) {
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      height: '300px',
      width: '350px',
      data: {task: taskToDelete}
    });
    dialogRef.afterClosed().subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          taskList.splice(taskList.indexOf(taskToDelete), 1);
        }
      }
    });
  }

  drop(event: CdkDragDrop<TaskResponse[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }



  protected readonly TaskPriority = TaskPriority;
}
