// task-modal.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaskModalComponent, TaskFormData } from './task-modal.component';

describe('TaskModalComponent', () => {
  let component: TaskModalComponent;
  let fixture: ComponentFixture<TaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskModalComponent],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.get('priority')?.value).toBe('Medium');
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.get('dueDate')?.value).toBe('');
  });

  it('should emit onClose when cancel button is clicked', () => {
    spyOn(component.onClose, 'emit');
    component.onCancel();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should emit onClose when overlay is clicked', () => {
    spyOn(component.onClose, 'emit');
    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: document.createElement('div')
    } as any;
    
    // Mock event where target equals currentTarget (clicking on overlay)
    mockEvent.target = mockEvent.currentTarget;
    
    component.onOverlayClick(mockEvent);
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should not emit onClose when modal content is clicked', () => {
    spyOn(component.onClose, 'emit');
    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: document.createElement('span') // Different elements
    } as any;
    
    component.onOverlayClick(mockEvent);
    expect(component.onClose.emit).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const titleControl = component.taskForm.get('title');
    const dueDateControl = component.taskForm.get('dueDate');
    const descriptionControl = component.taskForm.get('description');

    expect(titleControl?.hasError('required')).toBeTruthy();
    expect(dueDateControl?.hasError('required')).toBeTruthy();
    expect(descriptionControl?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum length for title and description', () => {
    const titleControl = component.taskForm.get('title');
    const descriptionControl = component.taskForm.get('description');

    titleControl?.setValue('ab'); // Less than 3 characters
    descriptionControl?.setValue('short'); // Less than 10 characters

    expect(titleControl?.hasError('minlength')).toBeTruthy();
    expect(descriptionControl?.hasError('minlength')).toBeTruthy();
  });

  it('should emit onTaskCreate when form is valid and submitted', () => {
    spyOn(component.onTaskCreate, 'emit');
    spyOn(component.onClose, 'emit');

    // Fill form with valid data
    component.taskForm.patchValue({
      title: 'Test Task',
      dueDate: '2024-12-31',
      priority: 'High',
      description: 'This is a test task description with enough characters'
    });

    component.onSubmit();

    expect(component.onTaskCreate.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Task',
      dueDate: '2024-12-31',
      priority: 'High',
      description: 'This is a test task description with enough characters'
    }));
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should not emit onTaskCreate when form is invalid', () => {
    spyOn(component.onTaskCreate, 'emit');
    spyOn(component.onClose, 'emit');

    // Leave form empty (invalid)
    component.onSubmit();

    expect(component.onTaskCreate.emit).not.toHaveBeenCalled();
    expect(component.onClose.emit).not.toHaveBeenCalled();
  });

  it('should handle file selection', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as any;

    spyOn(component as any, 'handleFile');
    component.onFileSelected(mockEvent);

    expect((component as any).handleFile).toHaveBeenCalledWith(mockFile);
  });

  it('should set drag over state correctly', () => {
    const mockEvent = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy()
    } as any;

    component.onDragOver(mockEvent);

    expect(component.isDragOver).toBeTruthy();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should remove image when removeImage is called', () => {
    component.selectedImage = 'test-image-data';
    component.removeImage();
    expect(component.selectedImage).toBeNull();
  });

  it('should reset form when resetForm is called', () => {
    // Set some values
    component.taskForm.patchValue({
      title: 'Test',
      description: 'Test description'
    });
    component.selectedImage = 'test-image';

    // Call private resetForm method
    (component as any).resetForm();

    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.get('priority')?.value).toBe('Medium');
    expect(component.selectedImage).toBeNull();
    expect(component.isDragOver).toBeFalsy();
  });

  it('should render modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeTruthy();
  });

  it('should not render modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeFalsy();
  });
});