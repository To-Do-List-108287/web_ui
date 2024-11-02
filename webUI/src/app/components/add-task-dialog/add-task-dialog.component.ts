import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

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
  ],
  providers: [],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {

}
