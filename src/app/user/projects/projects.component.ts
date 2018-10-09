import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../@services/project.service';
import { AuthService } from '../../@services/auth.service';
import { AngularFireAuth } from '../../../../node_modules/angularfire2/auth';
import { first } from 'rxjs/operators';
import { FirestoreService } from '../../@services/firestore.service';
import { listStagger } from '../../animations';
import { UserService } from '../../@services/user.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [listStagger]
})
export class ProjectsComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    private afAuth: AngularFireAuth,
    public userService: UserService,
    private db: FirestoreService,
    private auth: AuthService
  ) {}

  projects$: any = [];
  drafts$;

  async ngOnInit() {
    await this.afAuth.authState.pipe(first()).toPromise();

    this.projectService.getProjectsAPI().subscribe(data => {
      this.projects$ = data;
      console.log(data);
    });

    this.getDraftProjects();
  }

  getDraftProjects() {
    this.drafts$ = this.db.colWithIds$('/projects', ref =>
      ref.where('userId', '==', this.auth.currentUserId)
    );

    console.log(this.drafts$);
  }

  load(projectId) {
    // Set data for submission
    const data = {
      user: {
        currentProject: projectId
      }
    };

    this.userService
      .updateUser(`${this.auth.currentUserId}`, data)
      .subscribe((data: any) => {
        console.log('POST response: ', data);
      });

    this.projectService.projectItem = projectId;

    console.log('[Projects] Loaded ' + projectId);

    this.projectService.subscribeToProject();
  }

  delete(projectId) {}
}
