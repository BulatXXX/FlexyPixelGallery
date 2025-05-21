import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private locale$ = new BehaviorSubject<string>('en-UK');
  onLocaleChange$ = this.locale$.asObservable();

  get currentLocale(): string {
    return this.locale$.value;
  }

  setLocale(newLoc: 'en-UK' | 'ru-RU') {
    this.locale$.next(newLoc);
  }
}
