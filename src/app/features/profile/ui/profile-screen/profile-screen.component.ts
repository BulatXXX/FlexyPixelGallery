import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

import {ConfigurationCardComponent} from '../../../../ui/components/configuration-card/configuration-card.component';
import {panelConfigurations} from '../../../../models/PanelConfiguration';
import {MatIcon} from '@angular/material/icon';
import {UserService} from '../../UserService';
import {NotificationService} from '../../../../core/services/NotificationService';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
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
  private userService = inject(UserService);

  readonly publicId = this.route.snapshot.paramMap.get('publicId');
  readonly user = this.userService.user;
  readonly configurations = this.userService.all;
  readonly isOwnProfile = this.userService.isOwnProfile;

  constructor() {
    this.userService.loadUserProfile(this.publicId?.toString());
  }
}

