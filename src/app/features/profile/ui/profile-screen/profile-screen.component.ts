import {Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

import {ConfigurationCardComponent} from '../../../../ui/components/configuration-card/configuration-card.component';
import {panelConfigurations} from '../../../../models/PanelConfiguration';
import {MatIcon} from '@angular/material/icon';
import {UserService} from '../../UserService';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../core/services/NotificationService';
import {environment} from '../../../../app.config';


@Component({
  selector: 'app-profile-screen',

  templateUrl: './profile-screen.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    NgForOf,
    MatTabGroup,
    MatTab,
    ConfigurationCardComponent,
    MatIcon,
    MatLabel
  ],
  styleUrl: './profile-screen.component.css'
})
export class ProfileScreenComponent implements OnInit {
  token = '';

  publicId: string = '';
  email: string = '';
  username: string = '';
  displayName: string = '';
  phone: string = '';
  avatarUrl: any = '';
  bio: any = '';
  isVerified: boolean = false;
  role: string = '';
  mobileRole: string = '';
  createdAt: string = '';

  //заглушки
  profileConfigurations= panelConfigurations.filter(elem=>!elem.in_gallery)

  myPostConfigurations= panelConfigurations.filter(elem=>elem.in_gallery)
  editConfiguration(configId: string) {
    console.log(`Edit config: ${configId}`);
    // Здесь будет логика вызова ConfigurationService
  }

  addConfiguration(configId: string) {
    console.log(`Add config: ${configId}`);
    // Здесь будет логика вызова ConfigurationService
  }

  ngOnInit() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.publicId = data.publicId;
        this.email = data.email;
        this.username = data.username;
        this.displayName = data.displayName;
        this.phone = data.phone;
        this.avatarUrl = data.avatarUrl;
        this.bio = data.bio;
        this.isVerified = data.isVerified;
        this.role = data.role;
        this.mobileRole = data.mobileRole;
        this.createdAt = data.createdAt;
      },
      error: (err) => {
        this.notificationService.showError('Error loading user profile');
      }
    });
  }

  createPost(configId: string) {
    console.log(`Create post with config: ${configId}`);
  }

  constructor(private userService: UserService,private notificationService: NotificationService,) {
  }

  protected readonly environment = environment;
}

//заглушки
class Item{
  constructor(public num:number,public name:string) {
  }
}

