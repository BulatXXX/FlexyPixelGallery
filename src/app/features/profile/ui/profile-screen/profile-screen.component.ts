import {Component,inject} from '@angular/core';
import {NgIf} from '@angular/common';

import {UserService} from '../../UserService';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ProfileInfoComponent} from '../profile-info/profile-info.component';
import {ProfileTabsComponent} from '../profile-tabs/profile-tabs.component';



@Component({
  selector: 'app-profile-screen',

  templateUrl: './profile-screen.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ProfileInfoComponent,
    ProfileTabsComponent,
    NgIf
  ],
  styleUrl: './profile-screen.component.css'
})
export class ProfileScreenComponent {
  private route = inject(ActivatedRoute);
  protected userService = inject(UserService);

  readonly publicId = this.route.snapshot.paramMap.get('publicId');
  readonly user = this.userService.user;
  readonly all = this.userService.all;
  readonly original = this.userService.original;
  readonly forked = this.userService.forked;
  readonly publicOnly = this.userService.publicOnly;
  readonly isOwnProfile = this.userService.isOwnProfile;

  constructor() {
    this.userService.loadUserProfile(this.publicId?.toString());
  }
}

