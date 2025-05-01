import {Component, inject, Input, signal} from '@angular/core';
import {MatButton,} from '@angular/material/button';
import {MatCard} from '@angular/material/card';

import {DatePipe, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {UserService} from '../../UserService';

@Component({
  selector: 'app-profile-info',
  imports: [
    MatButton,
    MatCard,
    MatIcon,
    NgIf,
    DatePipe,
  ],
  templateUrl: './profile-info.component.html',
  standalone: true,
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
  @Input() user : any;


  @Input() isOwnProfile: boolean = false;

  hover = false;
  constructor(private userService: UserService) {

  }

  onAvatarSelected(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.userService.updateAvatar(file).subscribe({
      next: () => {
        // ничего не нужно делать здесь — сигнал уже обновился
        // и <img [src]="user.avatarUrl"> автоматически перерисуется
        this.userService.loadUserProfile();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

}
