import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() isCompleted: boolean = false;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();

  showColorPicker = false;
  
  colorOptions = [
    '#FFFFFF', '#FFF3E0', '#E8F5E8', '#E3F2FD',
    '#FCE4EC', '#F3E5F5', '#FFF8E1', '#E0F2F1',
    '#FFEBEE', '#F1F8E9', '#E8EAF6', '#FFF9C4'
  ];

  constructor() {}

  ngOnInit(): void {
    this.isCompleted = this.task.status === 'Completed';
  }

  // Status Management
  toggleTaskStatus(): void {
    let newStatus: 'Not Started' | 'In Progress' | 'Completed';
    
    switch (this.task.status) {
      case 'Not Started':
        newStatus = 'In Progress';
        break;
      case 'In Progress':
        newStatus = 'Completed';
        break;
      case 'Completed':
        newStatus = 'Not Started';
        break;
      default:
        newStatus = 'In Progress';
    }

    const updatedTask: Task = {
      ...this.task,
      status: newStatus,
      completedAt: newStatus === 'Completed' ? new Date() : undefined,
      updatedAt: new Date()
    };

    this.taskUpdated.emit(updatedTask);
  }

  restoreTask(): void {
    const updatedTask: Task = {
      ...this.task,
      status: 'In Progress' as const,
      completedAt: undefined,
      updatedAt: new Date()
    };

    this.taskUpdated.emit(updatedTask);
  }

  // Task Actions
  editTask(): void {
    // This will open an edit modal
    console.log('Editing task:', this.task.id);
    // Implementation will be added when we create the task edit modal
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task.id);
    }
  }

  showMenu(): void {
    // This will show a context menu with additional options
    console.log('Showing menu for task:', this.task.id);
  }

  // Color Management
  changeTaskColor(color: string): void {
    const updatedTask: Task = {
      ...this.task,
      backgroundColor: color,
      updatedAt: new Date()
    };

    this.taskUpdated.emit(updatedTask);
    this.showColorPicker = false;
  }

  toggleColorPicker(): void {
    this.showColorPicker = !this.showColorPicker;
  }

  // Utility Methods
  getPriorityClass(): string {
    return `priority-${this.task.priority.toLowerCase()}`;
  }

  getStatusClass(): string {
    return `status-${this.task.status.toLowerCase().replace(' ', '-')}`;
  }

  getStatusIcon(): string {
    switch (this.task.status) {
      case 'Not Started':
        return 'icon-play';
      case 'In Progress':
        return 'icon-pause';
      case 'Completed':
        return 'icon-check';
      default:
        return 'icon-play';
    }
  }

  getStatusToggleTitle(): string {
    switch (this.task.status) {
      case 'Not Started':
        return 'Start task';
      case 'In Progress':
        return 'Complete task';
      case 'Completed':
        return 'Restart task';
      default:
        return 'Change status';
    }
  }

  formatDueDate(): string {
    const today = new Date();
    const dueDate = new Date(this.task.dueDate);
    
    // Check if it's today
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Check if it's yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dueDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Format as date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(dueDate);
  }

  isOverdue(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today && this.task.status !== 'Completed';
  }

  getCompletedTime(): string {
    if (!this.task.completedAt) {
      return 'recently';
    }

    const now = new Date();
    const completed = new Date(this.task.completedAt);
    const diffInHours = Math.floor((now.getTime() - completed.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }
}