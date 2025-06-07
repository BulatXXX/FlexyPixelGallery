import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-firmware-screen',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './firmware-screen.component.html',
  standalone: true,
  styleUrl: './firmware-screen.component.css'
})
export class FirmwareScreenComponent {
  version = '1.0';
  firmwarePath = 'assets/firmware/flexypixel_1_0.hex';
}
