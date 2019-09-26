import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InnerpagesGuard implements CanActivate {
  constructor(public authentication: AuthenticationService,public router: Router, public toastr: ToastrService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authentication.isLoggedIn) {
        let user = JSON.parse(localStorage.getItem('user'));
        let id = user.uid;
         this.toastr.success('You are already logged in !!!');
         this.router.navigate([`profile/${id}`])
      }
      return true;
  }
  
}
