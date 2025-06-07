import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = '/api/tasks'; // This will be your backend API
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMockData(); // Remove this when connecting to real API
  }

  // Mock data for development - remove when connecting to backend
  private loadMockData(): void {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Attend Nischal\'s Birthday Party',
        description: 'Buy gifts on the way and pick up cake from the bakery. (6 PM)',
        dueDate: new Date('2024-06-20'),
        priority: 'Medium',
        status: 'Not Started',
        image: 'assets/images/birthday-party.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Landing Page Design for TravelDays',
        description: 'Get the work done by EOD and discuss with clients about the pricing. (3 PM | Meeting Room)',
        dueDate: new Date('2024-06-21'),
        priority: 'Medium',
        status: 'In Progress',
        image: 'assets/images/landing-page.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Presentation on Final Product',
        description: 'Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...',
        dueDate: new Date('2024-06-22'),
        priority: 'Medium',
        status: 'In Progress',
        image: 'assets/images/presentation.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Walk the dog',
        description: 'Take the dog to the park and bring treats as well.',
        dueDate: new Date('2024-06-19'),
        priority: 'Low',
        status: 'Completed',
        image: 'assets/images/walk-dog.jpg',
        completedAt: new Date('2024-06-19T14:30:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        title: 'Conduct meeting',
        description: 'Meet with the client and finalize requirements.',
        dueDate: new Date('2024-06-18'),
        priority: 'High',
        status: 'Completed',
        image: 'assets/images/meeting.jpg',
        completedAt: new Date('2024-06-18T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.tasksSubject.next(mockTasks);
  }

  // API Methods (implement these to connect to your backend)
  getAllTasks(): Observable<Task[]> {
    // Replace with actual API call
    // return this.http.get<Task[]>(this.baseUrl);
    return this.tasks$;
  }

  getTaskById(id: string): Observable<Task> {
    // Replace with actual API call
    // return this.http.get<Task>(`${this.baseUrl}/${id}`);
    const tasks = this.tasksSubject.value;
    const task = tasks.find(t => t.id === id);
    return new Observable(observer => {
      if (task) {
        observer.next(task);
        observer.complete();
      } else {
        observer.error('Task not found');
      }
    });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    // Replace with actual API call
    // return this.http.post<Task>(this.baseUrl, task);
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: 'Not Started',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
    
    return new Observable(observer => {
      observer.next(newTask);
      observer.complete();
    });
  }

  updateTask(task: UpdateTaskRequest): Observable<Task> {
    // Replace with actual API call
    // return this.http.put<Task>(`${this.baseUrl}/${task.id}`, task);
    
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      const updatedTask = {
        ...currentTasks[index],
        ...task,
        updatedAt: new Date()
      };
      
      currentTasks[index] = updatedTask;
      this.tasksSubject.next([...currentTasks]);
      
      return new Observable(observer => {
        observer.next(updatedTask);
        observer.complete();
      });
    }
    
    return new Observable(observer => {
      observer.error('Task not found');
    });
  }

  deleteTask(id: string): Observable<void> {
    // Replace with actual API call for soft delete
    // return this.http.patch<void>(`${this.baseUrl}/${id}/delete`, {});
    
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex(t => t.id === id);
    
    if (index !== -1) {
      currentTasks[index] = {
        ...currentTasks[index],
        isDeleted: true,
        updatedAt: new Date()
      };
      
      this.tasksSubject.next([...currentTasks]);
    }
    
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}