import {Component, Input} from '@angular/core';
import {MatCard} from '@angular/material/card';

import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-profile-tabs',
  imports: [
    MatCard,
    MatIcon,
    MatButton,
    NgIf
  ],
  templateUrl: './profile-tabs.component.html',
  standalone: true,
  styleUrl: './profile-tabs.component.css'
})
export class ProfileTabsComponent {
  @Input() configurations!: any;
  @Input() isOwnProfile!: any;

}
