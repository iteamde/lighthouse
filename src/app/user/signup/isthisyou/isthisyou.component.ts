import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../@services/user.service';
import { MatStepper } from '../../../../../node_modules/@angular/material';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-isthisyou',
  templateUrl: './isthisyou.component.html',
  styleUrls: ['./isthisyou.component.scss']
})
export class IsThisYouComponent implements OnInit {
  constructor(public userService: UserService) {}

  @Input('step')
  step: MatStepper;
  @Input('form')
  form: FormGroup;

  loading = false;

  foundUsers;

  ngOnInit() {
    console.log('Found ', this.userService.isThisYouData);
    console.log(this.form);
  }

  thisIsMe(rid) {
    console.log(rid);
    this.loading = true;

    this.userService.getUserDataByRid(rid).subscribe(data => {
      this.userService.IsThisYouSingle = data;

      this.userService.startSignUp(data);
      console.log('[Is this you]', this.userService.IsThisYouSingle);

      this.step.next();
      this.loading = false;
    });
  }

  thatsNotMe() {
    this.userService.isThisYou(false);
  }
}
