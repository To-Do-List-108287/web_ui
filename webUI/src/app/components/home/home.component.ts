import {Component, inject} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatCard} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {TaskResponse} from "../../models/TaskResponse";
import {MatIcon} from "@angular/material/icon";
import {TaskPriority} from "../../models/TaskPriority";
import {MatMiniFabButton} from "@angular/material/button";
import {DatePipe, NgClass, NgIf, NgStyle} from "@angular/common";
import {DeleteTaskDialogComponent} from "../delete-task-dialog/delete-task-dialog.component";
import {EditTaskDialogComponent} from "../edit-task-dialog/edit-task-dialog.component";
import {TaskService} from "../../services/task.service";
import {TaskCompletionStatus} from "../../models/TaskCompletionStatus";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatCard, MatIcon, MatMiniFabButton, NgStyle, NgClass, DatePipe, NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);
  taskService = inject(TaskService);
  todoTasks: TaskResponse[] = [];
  inProgressTasks: TaskResponse[] = [];
  doneTasks: TaskResponse[] = [];

  constructor(private datePipe: DatePipe) {
    this.taskService.getTasks().subscribe({
      next: (tasks: TaskResponse[]) => {
        tasks.forEach(task => {
          if (task.completionStatus === TaskCompletionStatus.TO_DO) {
            this.todoTasks.push(task);
          } else if (task.completionStatus === TaskCompletionStatus.IN_PROGRESS) {
            this.inProgressTasks.push(task);
          } else {
            this.doneTasks.push(task);
          }
        });
      },
      error: err => {
        console.error(err);
      }

    })
  }

  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'dd/MM');
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      height: '618px',
      width: '618px',
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

  openEditDialog(taskToEdit: TaskResponse) {
    this.dialog.open(EditTaskDialogComponent, {
      height: '618px',
      width: '618px',
      data: {task: taskToEdit}
    });
  }

  drop(event: CdkDragDrop<TaskResponse[]>) {

    if (event.previousContainer === event.container) {
      // staying in the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // moving to a different container
      // optimistic update - move the task to the new container in the UI and revert it if necessary
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const transferingTask: TaskResponse = event.container.data[event.currentIndex];
      const newCompletionStatus: TaskCompletionStatus = [
        TaskCompletionStatus.TO_DO,
        TaskCompletionStatus.IN_PROGRESS,
        TaskCompletionStatus.DONE
      ][parseInt(event.container.id.split('-').slice(-1)[0])]
      this.taskService.editTask(transferingTask.id, {"completionStatus": newCompletionStatus}).subscribe({
        next: (task: TaskResponse) => {
          Object.assign(transferingTask, task)
          // Task moved successfully - no need to change anything
        },
        error: (error) => {
          console.error(error)
          // Revert the change
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
          this._snackBar.open('Error changing task status. Try again later!', 'Close', {
            duration: 2000,
            panelClass: ['warning_snackbar']
          });
        }
      });
    }

  }

  protected readonly Date = Date;
  protected readonly String = String;
  protected readonly TaskPriority = TaskPriority;
}
