import { Component, Input } from '@angular/core';
import { CalEntry } from '@app/shared/models/calEntry.model';
import { AuthService } from '@app/shared/services';
import { User } from '@app/shared/interfaces';
import { Observable, merge } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  calEntries: Array<CalEntry> = [];

  user: User = {
    _id: '',
    fullname: '',
    email: '',
    createdAt: '',
    roles: [],
    registrations: [],
    safetyInstruction: new Date(),
    isAdmin: false,
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.user = user!;
      // console.log(this.user.isAdmin);
    });

    this.http
      .get<Array<CalEntry>>('api/lab-events/filter')
      .subscribe(calEntries => {
        this.calEntries = calEntries;
        // console.log(calEntries);
      });
  }
}
