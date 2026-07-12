import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ResumeBuilder } from './pages/resume-builder/resume-builder';
import { authGuard } from './guards/auth-guard';
import { PortfolioBuilder } from './pages/portfolio-builder/portfolio-builder';
import { Settings } from './pages/settings/settings';
import { Downloads } from './pages/downloads/downloads';
import { Templates } from './pages/templates/templates';
import { AiSuggestions } from './pages/ai-suggestions/ai-suggestions';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'resume-builder', component: ResumeBuilder, canActivate: [authGuard] },
  { path: 'portfolio-builder', component: PortfolioBuilder, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'downloads', component: Downloads, canActivate: [authGuard] },
  { path: 'templates', component: Templates, canActivate: [authGuard] },
  { path: 'ai-suggestions', component: AiSuggestions, canActivate: [authGuard] }
];