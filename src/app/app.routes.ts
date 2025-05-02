import {Routes} from '@angular/router';
import {HomeScreenComponent} from './ui/screens/home-screen/home-screen.component';
import {GalleryScreenComponent} from './ui/screens/gallery-screen/gallery-screen.component';
import {EditorScreenComponent} from './features/editor/editor-screen/editor-screen.component';
import {FaqScreenComponent} from './ui/screens/faq-screen/faq-screen.component';
import {FirmwareScreenComponent} from './ui/screens/firmware-screen/firmware-screen.component';
import {ProfileScreenComponent} from './features/profile/ui/profile-screen/profile-screen.component';
import {SignInScreenComponent} from './features/auth/ui/sign-in-screen/sign-in-screen.component';
import {SignUpScreenComponent} from './features/auth/ui/sign-up-screen/sign-up-screen.component';
import {
  PasswordRecoveryScreenComponent
} from './ui/screens/password-recovery-screen/password-recovery-screen.component';
import {AuthGuard} from './features/auth/AuthGuard';

export const routes: Routes = [
  {path: '', component: HomeScreenComponent},  // Главная страница
  {path: 'gallery', component: GalleryScreenComponent},
  {path: 'editor', component: EditorScreenComponent },
  {path: 'editor/:publicId', component: EditorScreenComponent},
  {path: 'firmware', component: FirmwareScreenComponent},
  {path: 'faq', component: FaqScreenComponent},
  {path: 'profile', component: ProfileScreenComponent, canActivate: [AuthGuard]},
  {path: 'sign-in', component: SignInScreenComponent},
  {path: 'sign-up', component: SignUpScreenComponent},
  {path: 'recovery', component: PasswordRecoveryScreenComponent}
];
