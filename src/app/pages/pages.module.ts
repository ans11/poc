import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';

import { RouterModule} from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [LoginComponent, DashboardComponent, SignupComponent, ProfileComponent],
  imports: [
    CommonModule,
    RouterModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    LoginComponent,
    DashboardComponent
  ]
})
export class PagesModule { }
