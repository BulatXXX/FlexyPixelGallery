import {Routes} from '@angular/router';
import {HomeScreenComponent} from './ui/screens/home-screen/home-screen.component';
import {GalleryScreenComponent} from './ui/screens/gallery-screen/gallery-screen.component';
import {EditorScreenComponent} from './features/editor/editor-screen/editor-screen.component';
import {FaqScreenComponent} from './ui/screens/faq-screen/faq-screen.component';
import {FirmwareScreenComponent} from './ui/screens/firmware-screen/firmware-screen.component';
import {ProfileScreenComponent} from './ui/screens/profile-screen/profile-screen.component';
import {SignInScreenComponent} from './ui/screens/sign-in-screen/sign-in-screen.component';
import {SignUpScreenComponent} from './ui/screens/sign-up-screen/sign-up-screen.component';
import {
  PasswordRecoveryScreenComponent
} from './ui/screens/password-recovery-screen/password-recovery-screen.component';

export const routes: Routes = [
  {path: 'home', component: HomeScreenComponent},  // Главная страница
  {path: 'gallery', component: GalleryScreenComponent},
  {path: 'editor', component: EditorScreenComponent},
  {path: 'firmware', component: FirmwareScreenComponent},
  {path: 'faq', component: FaqScreenComponent},
  {path: 'profile', component: ProfileScreenComponent},
  {path: 'signIn', component: SignInScreenComponent},
  {path: 'signUp', component: SignUpScreenComponent},
  {path: 'recovery', component: PasswordRecoveryScreenComponent}
];
