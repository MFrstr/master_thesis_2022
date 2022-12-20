import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { MachineListComponent } from './machine-list/machine-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    // only accessible if logged in
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    // view own profile
    // option to change credentials
  },
  {
    path: 'calendar-list',
    component: CalendarListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'machine-list',
    component: MachineListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
