import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthService {
  authState: any = null;
  public userDetails;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    this.afAuth.authState.subscribe(auth => {
      this.authState = auth;

      if (this.authenticated) {
        this.currentUserData();
      }
    });
  }

  /////////////////////////////////////
  //    Returns TRUE if logged in    //
  /////////////////////////////////////
  get authenticated(): boolean {
    return this.authState !== null;
  }

  emailAlreadyExists(email): any {
    return this.afAuth.auth.fetchProvidersForEmail(email);
  }

  /////////////////////////////////////
  //       Returns user data         //
  /////////////////////////////////////
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  public currentUserData() {
    this.userService.getUser(this.currentUserId).then(data => {
      (this.userDetails = data), console.log('[Auth]', this.userDetails.uid);
    });
  }

  public firstUserData() {
    return this.userService.getUser(this.currentUserId);
  }

  /////////////////////////////////////
  //          Returns user           //
  /////////////////////////////////////
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  /////////////////////////////////////
  //         Returns user ID         //
  /////////////////////////////////////
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  /////////////////////////////////////
  //         Anonymous User          //
  /////////////////////////////////////
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  /////////////////////////////////////
  //   Returns display name/guest    //
  /////////////////////////////////////
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState['displayName'] || 'User without a Name';
    }
  }

  /////////////////////////////////////
  //      SOCIAL AUTHENTICATION      //
  /////////////////////////////////////

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        if (credential.additionalUserInfo.isNewUser) {
          this.userService.signUpDetails.patchValue({
            email: credential.user.email,
            firstName: credential.additionalUserInfo.profile['given_name'],
            lastName: credential.additionalUserInfo.profile['family_name'],
            phoneNumber: credential.user.phoneNumber
          });
          this.router.navigate(['/signup'], { fragment: 'googleSignup' });
          console.log(credential);
          return credential;
        } else {
          console.log('[Auth] User exists');
          this.authState = credential.user;
          this.updateUserData().then(data => this.currentUserData());
          this.router.navigate(['/']);
        }
      })
      .catch(error => console.log(error));
  }

  /////////////////////////////////////
  //    Anonymous Authentication     //
  /////////////////////////////////////

  anonymousLogin() {
    return this.afAuth.auth
      .signInAnonymously()
      .then(user => {
        this.authState = user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  /////////////////////////////////////
  //  Email/password Authentication  //
  /////////////////////////////////////

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        console.log('[New Fireauth User]', user);
      })
      .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        this.updateUserData().then(data => this.currentUserData());
        this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
  }

  /////////////////////////////////////
  //         Reset password          //
  /////////////////////////////////////
  resetPassword(email: string) {
    const auth = firebase.auth();

    return auth
      .sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch(error => console.log(error));
  }

  /////////////////////////////////////
  //         Delete User         //
  /////////////////////////////////////
  deleteUser(email: string) {
    const user = firebase.auth().currentUser;

    return user
      .delete()
      .then(() => console.log('User removed from Firebase Auth'))
      .catch(error => console.log(error));
  }

  /////////////////////////////////////
  //            Sign out             //
  /////////////////////////////////////
  signOut(): void {
    this.projectService.delProjectItem(); // Remove project from Local Storage
    this.projectService.unsubscribeFromProject();
    this.userDetails = '';
    this.projectService.dateDetails.reset();
    this.afAuth.auth.signOut();
    console.log('[Auth] Logged out');
    this.router.navigate(['/']);
  }

  /////////////////////////////////////
  //      Project Data Helper        //
  /////////////////////////////////////
  async updateUserData() {
    const projectId = localStorage.getItem('projectId');

    if (projectId) {
      console.log(
        'Adding Project ' + projectId + ' to User ' + `${this.currentUserId}`
      );
      this.afs
        .doc('projects/' + projectId)
        .set({ userId: `${this.currentUserId}` }, { merge: true });

      // Set data for submission
      const data = {
        user: {
          currentProject: projectId
        }
      };

      this.userService
        .updateUser(`${this.currentUserId}`, data)
        .subscribe((data: any) => {
          console.log('POST response: ', data);
        });
    } else {
      await this.afAuth.authState.pipe(first()).toPromise();

      console.log('Logging in as: ', this.currentUserId);

      this.userService.getUser(`${this.currentUserId}`).then(result => {
        if (result.currentProject) {
          console.log('Loading current project ', result.currentProject);
          this.projectService.projectItem = result.currentProject;
          this.projectService.subscribeToProject();
        } else {
          console.log('No Project yet');
        }
      });
    }
  }
}
