import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import {ConfigurationCardComponent} from '../../../../shared/ui/configuration-card/configuration-card.component';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ConfigurationCardComponent,
    ConfigurationCardComponent,
    FormsModule
  ],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent {
  @Input() isOwnProfile = true;
  @Input() all: any[] = [];
  @Input() original: any[] = [];
  @Input() forked: any[] = [];
  @Input() publicOnly: any[] = [];

  selectedTab = 0;
  searchTerm = '';

  get tabs(): string[] {
    return this.isOwnProfile
      ? ['All','Original','Forked','Public']
      : ['Public'];
  }

  get activeConfigs(): any[] {
    if (!this.isOwnProfile) return this.publicOnly;
    switch (this.selectedTab) {
      case 1: return this.original;
      case 2: return this.forked;
      case 3: return this.publicOnly;
      default:  return this.all;
    }
  }

  get filteredConfigs(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.activeConfigs;
    return this.activeConfigs.filter(cfg =>
      cfg.name.toLowerCase().includes(term) ||
      (cfg.description?.toLowerCase().includes(term))
    );
  }

  onTabChange(i: number) {
    this.selectedTab = i;
    this.searchTerm = '';
  }
}
