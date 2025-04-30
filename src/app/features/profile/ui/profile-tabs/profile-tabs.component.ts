import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import {ConfigurationCardComponent} from '../../../../shared/ui/configuration-card/configuration-card.component';


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
    ConfigurationCardComponent
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
  searchTerm = signal('');

  readonly tabs = computed(() =>
    this.isOwnProfile
      ? ['All', 'Original', 'Forked', 'Public']
      : ['Public']
  );

  readonly activeConfigs = computed(() => {
    if (!this.isOwnProfile) {
      return this.publicOnly;
    }
    switch (this.selectedTab) {
      case 1: return this.original;
      case 2: return this.forked;
      case 3: return this.publicOnly;
      default: return this.all;
    }
  });

  readonly filteredConfigs = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.activeConfigs();
    }
    return this.activeConfigs().filter(cfg =>
      cfg.name.toLowerCase().includes(term) ||
      (cfg.description && cfg.description.toLowerCase().includes(term))
    );
  });
  @Input() configurations!: any[];

  onTabChange(index: number) {
    this.selectedTab = index;
    this.searchTerm.set(''); // сброс поиска при смене вкладки, опционально
  }
}
