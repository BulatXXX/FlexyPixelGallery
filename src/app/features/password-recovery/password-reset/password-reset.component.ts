import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordResetService} from '../password-reset.service';

@Component({
  selector: 'app-password-reset',
  imports: [
    FormsModule,
    MatFormField,
    MatCard,
    MatInput,
    NgIf,
    MatButton
  ],
  templateUrl: './password-reset.component.html',
  standalone: true,
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit {
  newPassword = signal<string>("");
  confirmPassword = signal<string>("");
  passwordReset = signal<boolean>(false);
  token: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private passwordResetService: PasswordResetService,) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.token = token;

       }else {
        void this.router.navigate(['/sign-in']);
      }
    });
  }

  submitNewPassword() {
    if (
      (this.newPassword() === this.confirmPassword()) &&
      this.token !== ""
    ) {
      this.passwordResetService.confirmNewPassword(this.token, this.newPassword()).subscribe(
        {
          next: () => {
            this.passwordReset.set(true)
          },
          error: err => {
            console.log(err)
          }
        }
      )
    } else {
      console.log(`not equals ${this.newPassword} and ${this.confirmPassword()}`)
    }
  }
}
