import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { FormGroup } from '@angular/forms';
import { tap, take, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ProjectService } from './@services/project.service';

@Directive({
  selector: '[fireForm]'
})
export class FireFormDirective implements OnInit, OnDestroy {
  // Inputs
  @Input()
  path: string;
  @Input()
  formGroup: FormGroup;

  // Internal state
  private _state: 'loading' | 'synced' | 'modified' | 'error';

  // Outputs
  @Output()
  stateChange = new EventEmitter<string>();
  @Output()
  formError = new EventEmitter<string>();

  // Firestore Document
  private docRef: AngularFirestoreDocument;

  // Subscriptions
  private formSub: Subscription;

  constructor(
    private afs: AngularFirestore,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.preloadData();
    this.autoSave();
  }

  // Loads initial form data from Firestore
  preloadData() {
    this.state = 'loading';
    this.docRef = this.getDocRef(this.path);
    this.docRef
      .valueChanges()
      .pipe(
        tap(doc => {
          if (doc) {
            if (doc.dateRange) {
              const start = new Date(doc.dateRange.start.seconds * 1000);
              doc.dateRange.start = start;
              const end = new Date(doc.dateRange.end.seconds * 1000);
              doc.dateRange.end = end;
            }

            this.formGroup.patchValue(doc);
            this.formGroup.markAsPristine();
            this.state = 'synced';
          }
        }),
        take(1)
      )
      .subscribe();
  }

  // Autosaves form changes
  autoSave() {
    this.formSub = this.formGroup.valueChanges
      .pipe(
        tap(change => {
          this.state = 'modified';
        }),
        debounceTime(2000),
        tap(change => {
          if (this.formGroup.valid && this._state === 'modified') {
            this.setDoc();
          }
        })
      )
      .subscribe();
  }

  // Intercept form submissions to perform the document write
  @HostListener('ngSubmit', ['$event'])
  onSubmit(e) {
    this.setDoc();
  }

  // Determines if path is a collection or document
  getDocRef(path: string): any {
    if (path.split('/').length % 2) {
      return this.afs.doc(`${path}/${this.afs.createId()}`);
    } else {
      return this.afs.doc(path);
    }
  }

  // Writes changes to Firestore
  async setDoc() {
    try {
      console.log('[Firestore] Updating project...');
      await this.docRef.set(this.formGroup.value, { merge: true });
      this.state = 'synced';
      this.projectService.quoteUpdated.next();
    } catch (err) {
      console.log(err);
      this.formError.emit(err.message);
      this.state = 'error';
    }
  }

  // Setter for state changes
  set state(val) {
    this._state = val;
    this.stateChange.emit(val);
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
