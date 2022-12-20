import { Component, OnInit } from '@angular/core';
import { Registrations, User } from '@app/shared/interfaces';
import { AuthService } from '../shared/services';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalEntry } from '@app/shared/models/calEntry.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userId!: any | null;
  message: string = '';
  registeredEvents: {} = {};

  user: User = {
    _id: '',
    fullname: '',
    email: '',
    createdAt: '',
    roles: [],
    registrations: [{ eventId: '', language: '' }],
    safetyInstruction: new Date(),
    isAdmin: false,
  };

  mailPattern: RegExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  userForm = this.fb.group({
    fullname: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z]{2,}.{0,}'), // min 2 letters
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.mailPattern),
    ]),
  });

  get fullname() {
    return this.userForm.get('fullname');
  }

  get email() {
    return this.userForm.get('email');
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.userForm.patchValue(user!);
      this.user = user!;
      this.userId = user!._id;
      console.log(user);
    });

    let eventIds = [];
    for (let i in this.user.registrations) {
      eventIds.push(this.user.registrations[i]['eventId']);
    }
    // send ids of events a user has registered for to
    // retrieve all the events as object with its params
    this.http
      .post<Array<CalEntry>>('api/lab-events/list-registered', {
        registrations: eventIds,
      })
      .subscribe(registeredEvents => {
        this.registeredEvents = registeredEvents;
        // console.log(this.registeredEvents);
      });
  }

  // go trough array of calEntry obj and take _id of each
  // compare it with the eventIds storeg in the user
  // if they match get the language saved in the user for this eventId
  // store a language as string and return it for the front end
  checkLanguageOfRegistration(EventId: string) {
    let eventId = EventId;
    let langEvent = '';
    for (let i in this.user.registrations) {
      if (eventId == this.user.registrations[i]['eventId']) {
        if (this.user.registrations[i]['language'] == 'eng') {
          langEvent = 'english';
          return langEvent;
        } else if (this.user.registrations[i]['language'] == 'de') {
          langEvent = 'deutsch';
          return langEvent;
        }
      }
    }
  }

  changeProfile(): void {
    const user = this.userForm.getRawValue();
    //console.log(this.userId);
    this.http
      .post<Object>('api/user/update', { user: user, id: this.userId })
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

  unregister(Id: string, Lang: string) {
    // let registrationsId = RegistrationsId;
    let calEntryId = Id;
    let lang = Lang;
    // dlt registration from user account
    this.http
      .post<String>('api/user/unregister', {
        userId: this.userId,
        calEntryId: calEntryId,
        lang: lang,
      })
      .subscribe(resp => {
        if (resp['message'] == 'error') {
          this.message = resp['message'];
          this.snackBar.open(this.message);
          return;
        }
      });
    // substract registration from calEntry object
    this.http
      .post<String>('api/lab-events/unregister', {
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
}
