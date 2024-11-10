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
    this.loadTasks(this.route.snapshot.queryParamMap.get('category'))
    this.loadCategories()
  }

  ngOnInit(): void {
    console.log('Home component initialized');
  }


  loadTasks(category: String | null = null) {
    this.taskService.getTasks(category).subscribe({
      next: (tasks: TaskResponse[]) => {
        this.todoTasks = [];
        this.inProgressTasks = [];
        this.doneTasks = [];
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
        this.taskCategories.sort();
        const passedCategory: string | null = this.route.snapshot.queryParamMap.get('category');
        if (passedCategory) {
          if (this.taskCategories.includes(passedCategory)) {
            this.selectedTaskCategory = passedCategory;
          } else {
            this._snackBar.open("Category doesn't exist. Showing all tasks.", 'Close', {
              duration: 2000,
              panelClass: ['warning_snackbar']
            });
          }
        }
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
    this.taskCategories.sort();
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
          this.updateCategories(task.category);
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
        if (task) {
          this.updateCategories(task.category);
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


  filterTasks() {
    this.router.navigate(['home'], {queryParams: {category: this.selectedTaskCategory}});
    this.loadTasks(this.selectedTaskCategory);
  }

  protected readonly Date = Date;
  protected readonly String = String;
  protected readonly TaskPriority = TaskPriority;
  protected readonly TaskCompletionStatus = TaskCompletionStatus;
}
