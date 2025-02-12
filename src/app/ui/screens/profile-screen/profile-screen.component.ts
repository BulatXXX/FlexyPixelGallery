import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-screen',
  imports: [],
  templateUrl: './profile-screen.component.html',
  standalone: true,
  styleUrl: './profile-screen.component.css'
})
export class ProfileScreenComponent {
  userName = '';
  token = '';

  ngOnInit() {
    // Получаем данные из localStorage
    this.userName = localStorage.getItem('username') || '';
    this.token = localStorage.getItem('token') || '';
  }

}
