import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeRu);
registerLocaleData(localeEn)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
