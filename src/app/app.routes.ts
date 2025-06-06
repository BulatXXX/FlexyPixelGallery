import {Routes} from '@angular/router';
import {HomeScreenComponent} from './shared/ui/screens/home-screen/home-screen.component';

import {EditorScreenComponent} from './features/editor/editor-screen/editor-screen.component';
import {FaqScreenComponent} from './shared/ui/screens/faq-screen/faq-screen.component';
import {FirmwareScreenComponent} from './shared/ui/screens/firmware-screen/firmware-screen.component';
import {ProfileScreenComponent} from './features/profile/ui/profile-screen/profile-screen.component';
import {SignInScreenComponent} from './features/auth/ui/sign-in-screen/sign-in-screen.component';
import {SignUpScreenComponent} from './features/auth/ui/sign-up-screen/sign-up-screen.component';
import {
  PasswordRecoveryScreenComponent
} from './features/password-recovery/password-recovery-screen/password-recovery-screen.component';
import {AuthGuard} from './features/auth/AuthGuard';
import {
  ConfigurationDetailScreenComponent
} from './features/configurations/ui/configuration-detail-screen/configuration-detail-screen.component';
import {GalleryScreenComponent} from './features/gallery/gallery-screen/gallery-screen.component';
import {PasswordResetComponent} from './features/password-recovery/password-reset/password-reset.component';

export const routes: Routes = [
  {path: '', component: HomeScreenComponent},  // Главная страница
  {path: 'gallery', component: GalleryScreenComponent, canActivate: [AuthGuard]},
  {path: 'editor', component: EditorScreenComponent, canActivate: [AuthGuard]},
  {path: 'editor/:publicId', component: EditorScreenComponent, canActivate: [AuthGuard]},
  {path: 'configurations/:publicId', component: ConfigurationDetailScreenComponent, canActivate: [AuthGuard]},
  {path: 'firmware', component: FirmwareScreenComponent},
  {path: 'faq', component: FaqScreenComponent},
  {path: 'profile', component: ProfileScreenComponent, canActivate: [AuthGuard]},
  {path: 'sign-in', component: SignInScreenComponent},
  {path: 'sign-up', component: SignUpScreenComponent},
  {path: 'recovery', component: PasswordRecoveryScreenComponent},
  {path: 'password-reset', component: PasswordResetComponent}
];
