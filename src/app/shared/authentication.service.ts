import { Injectable,NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { User } from '../shared/user'

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  private itemsCollection: AngularFirestoreCollection<any>;
   items: Observable<any[]>;
   constructor(public toastr:ToastrService, public angFirestore: AngularFirestore, public angFireauth: AngularFireAuth, public router: Router, public ngZone: NgZone) {
     this.angFireauth.authState.subscribe(user => {
       if (user) {
         this.userData = user;
         localStorage.setItem('user', JSON.stringify(this.userData));
         JSON.parse(localStorage.getItem('user'));
         console.log(JSON.parse(localStorage.getItem('user')));
       } else {
         localStorage.setItem('user', null);
         JSON.parse(localStorage.getItem('user'));
       }
     })
    }
 
    SignIn(email, password) {
 
     return this.angFireauth.auth.signInWithEmailAndPassword(email, password)
       .then((result) => {
         this.ngZone.run(() => {
           this.toastr.success('Successfully logged in');
           this.router.navigate(['profile']);
         });
         this.SetUserData(result.user);
       }).catch((error) => {
         this.toastr.error(error.message);
       })
     
   }
 
   // Sign up with email/password
   SignUp(email, password) {
     return this.angFireauth.auth.createUserWithEmailAndPassword(email, password)
       .then((result) => {
         this.toastr.success('Verification email sent successfully.');
         this.SendVerificationMail();
         this.SetUserData(result.user);
       }).catch((error) => {
         this.toastr.error(error.message);
       })
   }
 
   // Send email verfificaiton when new user sign up
   SendVerificationMail() {
     return this.angFireauth.auth.currentUser.sendEmailVerification()
     .then(() => {
       this.router.navigate(['verifyemail']);
     })
   }
 
   // Reset Forgot password
   ForgotPassword(passwordResetEmail) {
     return this.angFireauth.auth.sendPasswordResetEmail(passwordResetEmail)
     .then(() => {
       this.toastr.info('Mail sent to your mail address . Please check it');
     }).catch((error) => {
       this.toastr.error(error.message);
     })
   }
 
   // Returns true when user is logged in and email is verified
   get isLoggedIn(): boolean {
     const user = JSON.parse(localStorage.getItem('user'));
     return (user !== null && user.emailVerified != false) ? true : false;
   }
 
   // Sign in with Google
   GoogleAuth() {
     return this.AuthLogin(new auth.GoogleAuthProvider());
   }
 
   //Sign in with Facebook Login
   FacebookAuth(){
     return this.AuthLogin(new auth.FacebookAuthProvider());
   }
 
   // Auth logic to run auth providers
   AuthLogin(provider) {
     return this.angFireauth.auth.signInWithPopup(provider)
     .then((result) => {
        this.ngZone.run(() => {
         this.toastr.success('Successfully logged in');
         let id = result.user.uid;
         this.itemsCollection = this.angFirestore.collection<any>('users', ref => ref.where('userId', '==',id));
         this.items = this.itemsCollection.valueChanges();
         
         this.items.subscribe(data => {
           console.log(data);
          if(data.length == 0)
          {
            console.log('new user');
            let check = JSON.parse(localStorage.getItem('referal'));
            console.log(check);
            if(check === null)
            {
             this.SetUserData(result.user);
             this.router.navigate([`profile/${id}`]);
            }
            else
            {
             console.log ('Referred client');
             this.SetUserData(result.user);
             const ref = JSON.parse(localStorage.getItem('referal'))
             const itemsRef = this.angFirestore.collection('users');
             itemsRef.doc(id).update({ friends: firebase.firestore.FieldValue.arrayUnion(ref) , referred: true });
             itemsRef.doc(ref).update({friends: firebase.firestore.FieldValue.arrayUnion(id)});
             localStorage.removeItem('referal');
             this.router.navigate([`profile/${id}`]);
            }
          }
          else
          {
            console.log('existing user');
           this.router.navigate([`profile/${id}`]);
          }
           });
           
         })
       
     }).catch((error) => {
       this.toastr.error(error.message);
     })
   }
 
   //storing the signed up data into cloud firestore 
   SetUserData(user) {
     let flag  = false
     const ref = JSON.parse(localStorage.getItem('referal'))
     if(ref != '')
     {
       flag = false
     }
     else
     {
       flag = true
     }
     const userRef: AngularFirestoreDocument<any> = this.angFirestore.doc(`users/${user.uid}`);
     const userData: User = {
       userId: user.uid,
       userEmail: user.email,
       userName: user.displayName,
       profilePhotoURL: user.photoURL,
       emailFlag: user.emailVerified,
       organisation: 'Please edit profile',
       phonenumber:'Please edit profile',
       designation: 'Please edit profile',
       friends: ref,
       referred: flag
       
     }
     return userRef.set(userData, {
       merge: true
     })
   }
 
   // Sign out 
   SignOut() {
     return this.angFireauth.auth.signOut().then(() => {
       this.toastr.success('Successfully logged out');
       localStorage.clear();
       this.router.navigate(['login']);
     })
   }
}
