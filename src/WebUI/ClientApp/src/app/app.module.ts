import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenComponent } from './token/token.component';

// Dashboard Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskCardComponent } from './shared/task-card/task-card.component';
import { ProgressRingComponent } from './shared/progress-ring/progress-ring.component';

// Temporarily comment out API Authorization to test dashboard
// import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
// import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    // Dashboard Components
    DashboardComponent,
    TaskCardComponent,
    ProgressRingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // ApiAuthorizationModule, // Temporarily commented out
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    // Temporarily comment out auth interceptor
    // { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }