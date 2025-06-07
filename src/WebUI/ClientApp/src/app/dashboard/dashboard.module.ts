import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard.component';
import { TaskCardComponent } from '../shared/task-card/task-card.component';
import { ProgressRingComponent } from '../shared/progress-ring/progress-ring.component';

// Services (will be created later)
// import { TaskService } from '../services/task.service';
// import { DashboardService } from '../services/dashboard.service';

@NgModule({
  declarations: [
    DashboardComponent,
    TaskCardComponent,
    ProgressRingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    // TaskService,
    // DashboardService
  ],
  exports: [
    DashboardComponent,
    TaskCardComponent,
    ProgressRingComponent
  ]
})
export class DashboardModule { }