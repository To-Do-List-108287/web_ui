import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateTaskRequest} from "../models/CreateTaskRequest";
import {TaskResponse} from "../models/TaskResponse";
import {Observable} from "rxjs";
import {UpdateTaskRequest} from "../models/UpdateTaskRequest";
import {TaskSortingOption} from "../models/TaskSorting";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http: HttpClient = inject(HttpClient)
  private readonly baseURL : string = environment.API_URL + "tasks";

  constructor() { }

  createTask(task: CreateTaskRequest) : Observable<TaskResponse> {
    const url: string = this.baseURL;
    return this.http.post<TaskResponse>(url, task);
  }

  deleteTask(taskId: number): Observable<void> {
    const url: string = `${this.baseURL}/${taskId}`;
    return this.http.delete<void>(url);
  }

  editTask(taskId: number, updatedTask: Partial<UpdateTaskRequest>): Observable<TaskResponse> {
    const url: string = `${this.baseURL}/${taskId}`;
    return this.http.put<TaskResponse>(url, updatedTask);
  }

  getTasks(category: string | null, taskSortingOption: TaskSortingOption) : Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(
      `${this.baseURL}`
      + `?sort=${taskSortingOption.sortName}`
      + (category ? `&category=${category}` : '')
    );
  }

  getTaskCategories() : Observable<string[]> {
    return this.http.get<string[]>(`${this.baseURL}/categories`);
  }
}
