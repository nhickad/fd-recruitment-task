export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Not Started' | 'In Progress' | 'Completed';
    image?: string;
    tags?: string[];
    backgroundColor?: string;
    isDeleted?: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateTaskRequest {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'High' | 'Medium' | 'Low';
    tags?: string[];
    backgroundColor?: string;
  }
  
  export interface UpdateTaskRequest {
    id: string;
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: 'High' | 'Medium' | 'Low';
    status?: 'Not Started' | 'In Progress' | 'Completed';
    tags?: string[];
    backgroundColor?: string;
  }