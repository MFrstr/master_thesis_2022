import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';
import { CalendarFormComponent } from '@app/calendar-form/calendar-form.component';
import { MachineFormComponent } from '@app/machine-form/machine-form.component';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [OnlyAdminUsersGuard],
    // only for users that are admins
    children: [
      {
        path: '',
        component: AdminComponent,
      },
    ],
  },
  {
    // make new event
    path: 'lab-events',
    component: CalendarFormComponent,
  },
  {
    // edit existing event
    path: 'lab-events/:id',
    component: CalendarFormComponent,
    // canActivate: [EventOwnerGuard]
  },
  {
    // form for new machine
    path: 'machines',
    component: MachineFormComponent,
  },
  {
    // form to edit existing machine
    path: 'machines/:id',
    component: MachineFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
