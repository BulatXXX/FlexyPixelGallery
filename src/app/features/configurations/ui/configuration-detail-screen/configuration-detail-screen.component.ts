import { Component } from '@angular/core';
import {ConfigurationService} from '../../configuration.service';
import {DatePipe, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';

import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-configuration-detail-screen',
  imports: [
    NgIf,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatSlideToggle,
    MatButton,
    DatePipe
  ],
  templateUrl: './configuration-detail-screen.component.html',
  standalone: true,
  styleUrl: './configuration-detail-screen.component.css'
})
export class ConfigurationDetailScreenComponent {
  publicId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected service: ConfigurationService
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('publicId')!;
    this.service.load(this.publicId);
  }

  back() {
    void this.router.navigate(['/profile']);
  }

  save() {
    this.service.save();
  }

  publish(publicId: string) {

  }
}
