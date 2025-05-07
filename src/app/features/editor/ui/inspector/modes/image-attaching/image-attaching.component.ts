import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Coverage, ImageAttachingService, Target} from '../../../../service/ImageAttachingService';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';

import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-image-attaching',
  imports: [
    NgIf,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatButton,
    MatIcon,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './image-attaching.component.html',
  standalone: true,
  styleUrl: './image-attaching.component.css'
})
export class  ImageAttachingComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  previewUrl$!: Observable<string|null>;

  selectedCoverage: Coverage = 'cover';
  selectedTarget: Target = 'all';

  constructor(private imageAttachingService: ImageAttachingService) {}

  ngOnInit(): void {
    this.previewUrl$ = this.imageAttachingService.previewUrl$;
  }

  async onFileSelected(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    await this.imageAttachingService.loadFile(file);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (!file) return;
    void this.onFileSelected({ target: { files: [file] } } as any);
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  onCoverageChange(value: Coverage): void {
    this.selectedCoverage = value;
    this.imageAttachingService.setOptions({ coverage: value, target: this.selectedTarget });
  }

  onTargetChange(value: Target): void {
    this.selectedTarget = value;
    this.imageAttachingService.setOptions({ coverage: this.selectedCoverage, target: value });
  }

  apply(): void {
    void this.imageAttachingService.apply();
  }
}

