import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';

interface TaskStats {
  total: number;
  date: string;
}

interface TaskStatusStats {
  completed: { count: number; percentage: number };
  inProgress: { count: number; percentage: number };
  notStarted: { count: number; percentage: number };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // User data
  currentUser: User = {
    id: '1',
    name: 'Nhick Andrei Fabian',
    firstName: 'Nhick',
    email: 'nhickandreifabian@gmail.com',
    avatar: 'assets/images/avatar.jpg',
    createdAt: new Date()
  };

  // Date
  currentDate = new Date();

  // Search
  searchQuery = '';

  // Task data
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load tasks from service
  loadTasks(): void {
    this.taskService.getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }

  // Computed properties
  get activeTasks(): Task[] {
    return this.tasks.filter(task => 
      !task.isDeleted && 
      task.status !== 'Completed' && 
      this.matchesSearch(task)
    );
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => 
      !task.isDeleted && 
      task.status === 'Completed' && 
      this.matchesSearch(task)
    );
  }

  get todoStats(): TaskStats {
    const today = new Date();
    const todayTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.isDeleted &&
             taskDate.toDateString() === today.toDateString();
    });

    return {
      total: todayTasks.length,
      date: '• Today'
    };
  }

  get taskStatus(): TaskStatusStats {
    const allTasks = this.tasks.filter(task => !task.isDeleted);
    const total = allTasks.length;
    
    const completed = allTasks.filter(task => task.status === 'Completed').length;
    const inProgress = allTasks.filter(task => task.status === 'In Progress').length;
    const notStarted = allTasks.filter(task => task.status === 'Not Started').length;

    return {
      completed: {
        count: completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      },
      inProgress: {
        count: inProgress,
        percentage: total > 0 ? Math.round((inProgress / total) * 100) : 0
      },
      notStarted: {
        count: notStarted,
        percentage: total > 0 ? Math.round((notStarted / total) * 100) : 0
      }
    };
  }

  // Methods
  onSearch(): void {
    // Search is handled by the computed properties
    // This method can be used for additional search logic like debouncing
  }

  private matchesSearch(task: Task): boolean {
    if (!this.searchQuery.trim()) {
      return true;
    }
    
    const query = this.searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  addNewTask(): void {
    // This will open a modal or navigate to task creation
    console.log('Adding new task...');
    // Implementation will be added when we create the task creation modal
  }

  onTaskUpdated(updatedTask: Task): void {
    // Update the task in our local array
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask };
      
      // Also update via service (for backend sync)
      this.taskService.updateTask({
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        dueDate: updatedTask.dueDate,
        priority: updatedTask.priority,
        status: updatedTask.status,
        tags: updatedTask.tags,
        backgroundColor: updatedTask.backgroundColor
      }).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Task updated successfully:', updatedTask.id);
      });
    }
  }

  onTaskDeleted(taskId: string): void {
    // Update local array first
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        isDeleted: true,
        updatedAt: new Date()
      };
    }

    // Also update via service
    this.taskService.deleteTask(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Task deleted successfully:', taskId);
      });
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
    // This would typically call an authentication service
  }

  // ===== MISSING METHODS - ADD THESE =====

  // Helper method to get status class for task status indicators
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'not started':
        return 'status-not-started';
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-not-started';
    }
  }

  // Helper method to get priority class for priority badges
  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  // Helper method to get completed time for completed tasks
  getCompletedTime(task: Task): string {
    if (!task.completedAt && !task.updatedAt) {
      return 'recently';
    }

    const completedDate = task.completedAt || task.updatedAt;
    const now = new Date();
    const completed = new Date(completedDate);
    const diffTime = Math.abs(now.getTime() - completed.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
  }

  // ===== EXISTING UTILITY METHODS =====

  // Utility methods
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getTaskPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getTaskStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}