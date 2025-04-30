import {Component, Input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';

import {DatePipe, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-profile-info',
  imports: [
    MatButton,
    MatCard,
    MatIcon,
    NgIf,
    DatePipe
  ],
  templateUrl: './profile-info.component.html',
  standalone: true,
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
  @Input() user!: any;
  @Input() isOwnProfile: boolean = false;
}
