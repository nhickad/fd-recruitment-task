// task-modal.component.ts

import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface TaskFormData {
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  image?: string;
}

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onTaskCreate = new EventEmitter<TaskFormData>();
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  taskForm!: FormGroup;
  selectedImage: string | null = null;
  isDragOver = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Form validation method
  isFormValid(): boolean {
    return this.taskForm.valid && 
           this.taskForm.get('title')?.value?.trim() !== '' &&
           this.taskForm.get('dueDate')?.value !== '' &&
           this.taskForm.get('description')?.value?.trim() !== '';
  }

  // Modal Actions
  onCancel(): void {
    this.resetForm();
    this.onClose.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    // Close modal when clicking on overlay (not the modal content)
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const formData: TaskFormData = {
        ...this.taskForm.value,
        image: this.selectedImage || undefined
      };
      
      console.log('📤 Submitting task form data:', formData); // Debug log
      console.log('🖼️ Image in form data:', formData.image ? 'Image present' : 'No image'); // Debug log
      
      this.onTaskCreate.emit(formData);
      this.resetForm();
      this.onClose.emit();
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }

  private resetForm(): void {
    this.taskForm.reset({
      title: '',
      dueDate: '',
      priority: 'Medium',
      description: ''
    });
    this.selectedImage = null;
    this.isDragOver = false;
    
    // Reset validation states
    this.taskForm.markAsUntouched();
    this.taskForm.markAsPristine();
  }

  // File Upload Handlers
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.handleFile(file);
      } else {
        // Handle non-image file error
        console.warn('Please select an image file');
      }
    }
  }

  private handleFile(file: File): void {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn('File size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.warn('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Getters for form validation
  get title() { return this.taskForm.get('title'); }
  get dueDate() { return this.taskForm.get('dueDate'); }
  get priority() { return this.taskForm.get('priority'); }
  get description() { return this.taskForm.get('description'); }
}