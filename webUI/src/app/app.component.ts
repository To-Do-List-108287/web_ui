import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {initFlowbite} from "flowbite";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'webUI';

  ngOnInit(): void {
    initFlowbite();
  }

}
