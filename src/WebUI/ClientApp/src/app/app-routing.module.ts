import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenComponent } from './token/token.component';

// Temporarily remove AuthorizeGuard to test if dashboard loads
export const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent, 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'token', 
    component: TokenComponent 
  },
  // Redirect any unknown routes to dashboard
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}