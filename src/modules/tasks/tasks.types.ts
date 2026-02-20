export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED"
}

export interface CreateTaskDTO {
  title: string
  description?: string
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
}

