import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule],
  providers: [OnlyAdminUsersGuard, DatePipe],
})
export class AdminModule {}
