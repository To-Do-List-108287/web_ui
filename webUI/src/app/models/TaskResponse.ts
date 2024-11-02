import {TaskPriority} from "./TaskPriority";
import {TaskCompletionStatus} from "./TaskCompletionStatus";

export interface TaskResponse {
  id: number,
  title: string,
  description: string,
  creationDate: string,
  lastUpdated: string,
  deadline: string,
  completionStatus: TaskCompletionStatus,
  priority: TaskPriority,
}
