import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/shared/interfaces';
import { AuthService } from '../shared/services';
import { CalEntry } from '@app/shared/models/calEntry.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { number, string } from 'joi';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent implements OnInit {
  calEntries: Array<CalEntry> = [];
  message: string = '';

  months: { name: string; value: number }[] = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.user = user!;
      // console.log(this.user.isAdmin);
    });

    this.http
      .get<Array<CalEntry>>('api/lab-events/list')
      .subscribe(calEntries => {
        this.calEntries = calEntries;
        // console.log(this.calEntries);
      });
  }
  // loop through the registrations obj in user obj
  // of user is registered for an event
  // the buttons to register for it become disabled
  checkRegistrations(CalEntryId: string) {
    let id = CalEntryId;
    for (let i in this.user.registrations) {
      if (id == this.user.registrations[i]['eventId']) {
        return true;
      }
    }
  }

  registerEnglish(Id: string, Lang: string, UserId: string) {
    let calEntryId = Id;
    let lang = Lang;
    let userId = UserId;
    this.http
      .post<Object>('api/lab-events/update', {
        calEntryId: calEntryId,
        lang: lang,
      })
      // if error
      .subscribe(resp => {
        if (resp['message'] != 'success') {
          this.message = resp['message'];
          this.snackBar.open(this.message);
        }
      });
    this.http
      .post<Object>('api/user/register', {
        userId: userId,
        calEntryId: calEntryId,
        lang: lang,
      })
      .subscribe(resp => {
        this.message = resp['message'];
        const snackBarRef = this.snackBar.open(this.message);
        snackBarRef.afterDismissed().subscribe(() => {
          if (resp['status'] == 'success') {
            location.reload();
          }
        });
      });
  }

  registerGerman(Id: string, Lang: string, UserId: string) {
    let calEntryId = Id;
    let lang = Lang;
    let userId = UserId;
    this.http
      .post<Object>('api/lab-events/update', {
        calEntryId: calEntryId,
        lang: lang,
      })
      .subscribe(resp => {
        if (resp['message'] != 'success') {
          this.message = resp['message'];
          this.snackBar.open(this.message);
        }
      });
    this.http
      .post<Object>('api/user/register', {
        userId: userId,
        calEntryId: calEntryId,
        lang: lang,
      })
      .subscribe(resp => {
        this.message = resp['message'];
        const snackBarRef = this.snackBar.open(this.message);
        snackBarRef.afterDismissed().subscribe(() => {
          if (resp['status'] == 'success') {
            location.reload();
          }
        });
      });
  }

  getEventsOfMonth(Month: number) {
    let month = Month;
    // console.log(Month);
    this.http
      .post<Object>('api/lab-events/month', { month: month })
      .subscribe(resp => {
        if (resp['status'] == 'error') {
          this.message = resp['message'];
          const snackBarRef = this.snackBar.open(this.message);
        }
        // get list of filtered events
        this.calEntries = resp['calEntries'];
      });
  }
}
