import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InnerpagesGuard } from './shared/innerpages.guard';
import { AuthGuard } from './shared/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo:'login', pathMatch:'full' },
      { path: 'login', component: LoginComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'profile/:id', component: ProfileComponent}
      
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: true}),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
