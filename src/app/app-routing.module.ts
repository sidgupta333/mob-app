import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./public/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./public/register/register.module').then(m => m.RegisterPageModule) },
  {
    path: 'members',
    canActivate: [AuthGuard],
    loadChildren: () => import('./members/member-routing.module').then(m => m.MemberRoutingModule)
  },

  { path: 'login-custom', loadChildren: './public/login-custom/login-custom.module#LoginCustomPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
