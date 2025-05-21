import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './ui/components/header/header.component';
import {LoadingOverlayComponent} from './core/components/loading-overlay/loading-overlay.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
    const browserLang = navigator.language.split('-')[0];
    translate.use(
      translate.getLangs().includes(browserLang)
        ? browserLang
        : 'en'
    );
  }

  title = 'FlexyPixelGallery';
}
