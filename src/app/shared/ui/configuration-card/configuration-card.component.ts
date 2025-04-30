import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-configuration-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './configuration-card.component.html',
  styleUrls: ['./configuration-card.component.css']
})
export class ConfigurationCardComponent {
  @Input() config!: {
    publicId: string;
    name: string;
    description: string;
    previewImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    forkStatus: 'ORIGINAL' | 'ADDED' | 'MODIFIED';
    forkInfo: any | null;
    isPublic?: boolean;
  };

  onPublish(publicId: string) {

  }
}
