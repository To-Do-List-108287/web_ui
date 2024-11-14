import {Component, inject, OnInit} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatCard} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {TaskResponse} from "../../models/TaskResponse";
import {MatIcon} from "@angular/material/icon";
import {TaskPriority} from "../../models/TaskPriority";
import {MatMiniFabButton} from "@angular/material/button";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {DeleteTaskDialogComponent} from "../delete-task-dialog/delete-task-dialog.component";
import {EditTaskDialogComponent} from "../edit-task-dialog/edit-task-dialog.component";
import {TaskService} from "../../services/task.service";
import {TaskCompletionStatus} from "../../models/TaskCompletionStatus";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatCard, MatIcon, MatMiniFabButton, NgStyle, NgClass, DatePipe, NgIf, MatSelect, MatFormField, MatOption, NgForOf,
    MatFormFieldModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);
  taskService = inject(TaskService);
  todoTasks: TaskResponse[] = [];
  inProgressTasks: TaskResponse[] = [];
  doneTasks: TaskResponse[] = [];
  allCompletionStatus: TaskCompletionStatus[] = [
    TaskCompletionStatus.TO_DO,
    TaskCompletionStatus.IN_PROGRESS,
    TaskCompletionStatus.DONE
  ]
  tasksByCompletionStatus = {
    [TaskCompletionStatus.TO_DO]: this.todoTasks,
    [TaskCompletionStatus.IN_PROGRESS]: this.inProgressTasks,
    [TaskCompletionStatus.DONE]: this.doneTasks
  }
  selectedTaskCategory: string = '';
  taskCategories: string[] = [];

  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private router: Router) {
    this.loadCategories()
  }



  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.loadTasks(params["category"])
      }
    })
  }


  loadTasks(category: string | null = null) {
    if (category !== null){
      this.selectedTaskCategory = category;
    }
    this.taskService.getTasks(category).subscribe({
      next: (tasks: TaskResponse[]) => {
        this.todoTasks.length = 0
        this.inProgressTasks.length = 0;
        this.doneTasks.length = 0;
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
        this._snackBar.open('Error loading tasks. Try again later!', 'Close', {
          duration: 2000,
          panelClass: ['warning_snackbar']
        });
      }
    })
  }

  loadCategories() {
    this.taskService.getTaskCategories().subscribe({
      next: (categories: string[]) => {
        this.taskCategories = categories;
        this.taskCategories.sort((a, b) => a.localeCompare(b));
      },
      error: err => {
        console.error(err);
      }
    });
  }

  updateCategories(newCategory: String){
    const localTaskCategories: Set<String> = new Set<String>(this.taskCategories);
    localTaskCategories.add(newCategory);
    this.taskCategories = Array.from(localTaskCategories) as string[];
    this.taskCategories.sort((a, b) => a.localeCompare(b));
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
          this.updateCategories(task.category);
          if (task.category === this.selectedTaskCategory) {
            this.todoTasks.push(task);
          }
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
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      height: '618px',
      width: '618px',
      data: {task: taskToEdit}
    });
    dialogRef.afterClosed().subscribe({
      next: (task: TaskResponse) => {
        this.updateCategories(task.category);
        // If I'm filtering by category and category has changed, remove the task from the old category
        // so not to display task on the wrong category
        if (this.selectedTaskCategory !== '' && this.selectedTaskCategory !== task.category) {
          if (taskToEdit.completionStatus === TaskCompletionStatus.TO_DO) {
            this.todoTasks.splice(this.todoTasks.indexOf(taskToEdit), 1);
          } else if (taskToEdit.completionStatus === TaskCompletionStatus.IN_PROGRESS) {
            this.inProgressTasks.splice(this.inProgressTasks.indexOf(taskToEdit), 1);
          } else {
            this.doneTasks.splice(this.doneTasks.indexOf(taskToEdit), 1);
          }
        }
      }
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
      const transferringTask: TaskResponse = event.container.data[event.currentIndex];
      const newCompletionStatus: TaskCompletionStatus = this.allCompletionStatus[
        parseInt(event.container.id.split('-').slice(-1)[0])
      ]
      this.taskService.editTask(transferringTask.id, {"completionStatus": newCompletionStatus}).subscribe({
        next: (task: TaskResponse) => {
          Object.assign(transferringTask, task)
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

  moveTask(transferringTask: TaskResponse, newCompletionStatus: TaskCompletionStatus) {
    const oldCompletionStatus: TaskCompletionStatus = transferringTask.completionStatus;
    const oldTaskList: TaskResponse[] = this.tasksByCompletionStatus[oldCompletionStatus];
    const newTaskList: TaskResponse[] = this.tasksByCompletionStatus[newCompletionStatus];
    const oldIndex = oldTaskList.indexOf(transferringTask);
    const newIndex = 0;
    this.taskService.editTask(transferringTask.id, {"completionStatus": newCompletionStatus}).subscribe({
      next: (task: TaskResponse) => {
        Object.assign(transferringTask, task)
        transferArrayItem(
          oldTaskList,
          newTaskList,
          oldIndex,
          newIndex,
        );
      },
      error: (error) => {
        console.error(error)
        this._snackBar.open('Error changing task status. Try again later!', 'Close', {
          duration: 2000,
          panelClass: ['warning_snackbar']
        });
      }
    });
  }

  clearFiltersAndSort() {
    this.selectedTaskCategory = '';
  }


  filterTasks() {
    if (!this.taskCategories.includes(this.selectedTaskCategory)) {
      this.selectedTaskCategory = '';
    }
    this.router.navigate(['home'], {queryParams: {category: this.selectedTaskCategory}});
  }

  protected readonly Date = Date;
  protected readonly String = String;
  protected readonly TaskPriority = TaskPriority;
  protected readonly TaskCompletionStatus = TaskCompletionStatus;
}
