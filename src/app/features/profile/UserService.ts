import {Injectable, inject, signal} from '@angular/core';
import {UserRepository} from './UserRepository';
import {LoadingService} from '../../core/services/LoadingService';
import {finalize, map, Observable, tap} from 'rxjs';
import {LibraryConfigurationRepository} from '../configurations/library-configuration.repository';

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly repo = inject(UserRepository);
  private readonly libraryConfigurationRepository = inject(LibraryConfigurationRepository);
  private readonly loadingService = inject(LoadingService);

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
    this.loadingService.show()
    if (isOwn) {
      this.libraryConfigurationRepository.getAllConfigurations().pipe(
        finalize(() => {
          this.loadingService.hide()
        })
      ).subscribe(this.all.set);
      this.libraryConfigurationRepository.getOriginalConfigurations().subscribe(this.original.set);
      this.libraryConfigurationRepository.getForkedConfigurations().subscribe(this.forked.set);
      this.libraryConfigurationRepository.getPublicConfigurations().subscribe(this.publicOnly.set);
    } else {
      this.repo.getPublicConfigurationsByUser(publicId!).pipe(finalize(() => {
        this.loadingService.hide()
      })).subscribe(this.publicOnly.set);
    }
  }

  updateAvatar(file: File) {
    return this.repo.uploadAvatar(file).pipe(
      // ответ { avatarUrl: string }
      map(resp => resp.avatarUrl),
      tap(newUrl => {
        // обновляем всю модель user
        const u = this.user();
        if (u) {
          this.user.set({ ...u, avatarUrl: newUrl });
        }
      })
    );
  }

  updateProfileInfo(displayName: string, bio: string): Observable<{ displayName: string; bio: string }> {
    return this.repo.updateUserInfo(displayName, bio).pipe(
      map(resp => ({
        displayName: resp.displayName,
        bio: resp.bio
      })),

      tap(newData => {
        const u = this.user();
        if (u) {
          this.user.set({
            ...u,
            displayName: newData.displayName,
            bio: newData.bio
          });
        }
      })
    );
  }

}
