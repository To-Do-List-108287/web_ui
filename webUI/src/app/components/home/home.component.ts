import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, MatCard
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  todoTasks = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  inProgressTasks = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  doneTasks = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
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
}
