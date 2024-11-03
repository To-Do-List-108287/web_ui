import {Component, inject} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatCard} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {TaskResponse} from "../../models/TaskResponse";
import {MatIcon} from "@angular/material/icon";
import {TaskPriority} from "../../models/TaskPriority";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatCard, MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  todoTasks: TaskResponse[] = [];
  inProgressTasks: TaskResponse[] = [];
  doneTasks: TaskResponse[] = [];

  openDialog() {
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
