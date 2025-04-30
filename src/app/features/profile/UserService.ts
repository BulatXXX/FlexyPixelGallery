import { Injectable, inject, signal } from '@angular/core';
import { UserRepository } from './UserRepository';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly repo = inject(UserRepository);

  user = signal<any | null>(null);

  all = signal<any[]>([]);
  original = signal<any[]>([]);
  forked = signal<any[]>([]);
  publicOnly = signal<any[]>([]);

  isOwnProfile = signal<boolean>(true);

  loadUserProfile(publicId?: string): void {
    const isOwn = !publicId;
    this.isOwnProfile.set(isOwn);

    const user$ = isOwn
      ? this.repo.getCurrentUser()
      : this.repo.getUserById(publicId);

    user$.subscribe(user => this.user.set(user));

    if (isOwn) {
      this.repo.getAllConfigurations().subscribe(this.all.set);
      this.repo.getOriginalConfigurations().subscribe(this.original.set);
      this.repo.getForkedConfigurations().subscribe(this.forked.set);
      this.repo.getPublicConfigurations().subscribe(this.publicOnly.set);
    } else {
      this.repo.getPublicConfigurationsByUser(publicId!).subscribe(this.publicOnly.set);
    }
  }
}
