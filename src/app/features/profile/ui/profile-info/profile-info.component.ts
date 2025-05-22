import {Component, Input} from '@angular/core';
import {MatButton, MatFabButton,} from '@angular/material/button';
import {MatCard} from '@angular/material/card';

import {DatePipe, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {UserService} from '../../UserService';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatSuffix} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'app-profile-info',
  imports: [
    MatButton,
    MatCard,
    MatIcon,
    NgIf,
    DatePipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    CdkTextareaAutosize,
    MatFabButton,
  ],
  templateUrl: './profile-info.component.html',
  standalone: true,
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent {
  @Input() user : any;
  @Input() isOwnProfile: boolean = false;

  isEditing: boolean = false;
  editedName: string = "";
  editedBio: string = "";

  hover = false;
  constructor(private userService: UserService) {
  }

  onAvatarSelected(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.userService.updateAvatar(file).subscribe({
      next: () => {
        this.userService.loadUserProfile();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  onUpdate(){
    this.userService.updateProfileInfo(this.editedName, this.editedBio).subscribe({
      next: () => {
        this.userService.loadUserProfile();
        this.isEditing = false;
      },
      error: (err) => console.error('Upload failed', err)
    })
  }

}
