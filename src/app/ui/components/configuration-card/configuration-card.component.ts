import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import { MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf, NgOptimizedImage} from '@angular/common';



@Component({
  selector: 'app-configuration-card',
  templateUrl: './configuration-card.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgIf,
  ],
  styleUrl: './configuration-card.component.css'
})
export class ConfigurationCardComponent {
  @Input() configName!: string;
  @Input() configId!: string;
  @Input() panelNumbers!: number;
  @Input() animated!: boolean;
  @Input() authorName!: string;
  @Input() previewUrl!: string;
  @Input() inGallery!: boolean;

  @Output() edit = new EventEmitter<string>();
  @Output() add = new EventEmitter<string>();
  @Output() create_post = new EventEmitter<string>();

  isLoading: boolean = true;
  isError: boolean = false;

  onLoad(){
    console.log("ok")
    this.isLoading = false;
  }

  onError(){
    console.log("ok")
    this.isLoading = false;
    this.isError = true;
  }


  onCreatePost(){
    this.create_post.emit(this.configId);
  }

  onEdit() {
    this.edit.emit(this.configId);
  }

  onAdd() {
    this.add.emit(this.configId);
  }

}
