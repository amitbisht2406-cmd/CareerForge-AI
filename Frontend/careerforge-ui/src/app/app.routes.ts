import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ResumeBuilder } from './pages/resume-builder/resume-builder';
import { PortfolioBuilder } from './pages/portfolio-builder/portfolio-builder';
import { Settings } from './pages/settings/settings';
import { Downloads } from './pages/downloads/downloads';
import { Templates } from './pages/templates/templates';
import { AiSuggestions } from './pages/ai-suggestions/ai-suggestions';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuard } from './guards/auth-guard';
import { PortfolioView } from './pages/portfolio-view/portfolio-view';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'portfolio/:id', component: PortfolioView },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'resume-builder', component: ResumeBuilder },
      { path: 'portfolio-builder', component: PortfolioBuilder },
      { path: 'settings', component: Settings },
      { path: 'downloads', component: Downloads },
      { path: 'templates', component: Templates },
      { path: 'ai-suggestions', component: AiSuggestions }
    ]
  },
  { path: '**', redirectTo: '' }
];