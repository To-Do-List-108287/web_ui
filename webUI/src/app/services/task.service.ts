import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateTaskRequest} from "../models/CreateTaskRequest";
import {TaskResponse} from "../models/TaskResponse";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http: HttpClient = inject(HttpClient)
  private baseURL : string = environment.API_URL + "tasks";

  constructor() { }

  createTask(task: CreateTaskRequest) : Observable<TaskResponse> {
    const url: string = this.baseURL;
    return this.http.post<TaskResponse>(url, task);
  }
}
