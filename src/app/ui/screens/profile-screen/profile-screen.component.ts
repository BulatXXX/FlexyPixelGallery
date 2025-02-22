import {Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

import {ConfigurationCardComponent} from '../../components/configuration-card/configuration-card.component';
import {panelConfigurations} from '../../../models/PanelConfiguration';
import {MatIcon} from '@angular/material/icon';


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

  userName = '';
  token = '';


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
    // Получаем данные из localStorage
    // this.userName = localStorage.getItem('username') || '';
    // this.token = localStorage.getItem('token') || '';
  }

  createPost(configId: string) {
    console.log(`Create post with config: ${configId}`);
  }
}

//заглушки
class Item{
  constructor(public num:number,public name:string) {
  }
}

