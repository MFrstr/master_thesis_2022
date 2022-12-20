import { Component, OnInit } from '@angular/core';
import { CalEntry } from '@app/shared/models/calEntry.model';
import { AuthService } from '../shared/services';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, Time } from '@angular/common';

@Component({
  selector: 'app-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss'],
})
export class CalendarFormComponent implements OnInit {
  calEntry: CalEntry = new CalEntry();
  calEntryId: any;
  message: string = '';
  calEntryFormIsNew: boolean = false;
  mstep = 15;

  formIsInvalid: boolean = false;

  calEntryForm = this.fb.group({
    startDate: new FormControl(new Date().toLocaleDateString(), [
      Validators.required,
    ]),
    startTime: new FormControl('', [Validators.required]),
    endDate: new FormControl(new Date().toLocaleDateString(), [
      Validators.required,
    ]),
    endTime: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    numOfRegistrations: new FormControl(0),
    requestsEnglish: new FormControl(0),
    requestsGerman: new FormControl(0),
  });

  get startDate() {
    return this.calEntryForm.get('startDate');
  }
  get endDate() {
    return this.calEntryForm.get('endDate');
  }
  get startTime() {
    return this.calEntryForm.get('startTime');
  }
  get endTime() {
    return this.calEntryForm.get('endTime');
  }
  get title() {
    return this.calEntryForm.get('title');
  }
  get description() {
    return this.calEntryForm.get('description');
  }
  get location() {
    return this.calEntryForm.get('location');
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.populateForm();
    this.calEntryId = this.route.snapshot.paramMap.get('id');

    // on empty form set endDate as startDate is given
    if (this.calEntryFormIsNew) {
      this.calEntryForm.get('startDate')?.valueChanges.subscribe(date => {
        this.calEntryForm.controls.endDate.setValue(date);
      });
    }
  }

  populateForm(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      let calEntryId = this.route.snapshot.paramMap.get('id');
      this.http
        .get<CalEntry>('api/lab-events/list?id=' + calEntryId)
        .subscribe(calEntry => {
          // console.log(calEntry);
          // transform date object via date pipe
          let startDate = this.datePipe.transform(
            calEntry.startDate,
            'yyyy-MM-dd'
          );
          let endDate = this.datePipe.transform(calEntry.endDate, 'yyyy-MM-dd');
          this.calEntryForm.patchValue(calEntry);
          this.calEntryForm.patchValue(
            // display transformed date object in form
            { startDate: startDate, endDate: endDate }
          );
          // patch hours & mins in timepicker
          // startTime eg.: 14:30
          // first two indices => hours
          // last two => minutes
          let startHour = parseInt(calEntry.startTime.toString().slice(0, 2));
          let startMinute = parseInt(calEntry.startTime.toString().slice(-2));
          this.calEntryForm.controls.startTime.setValue({
            hour: startHour as number,
            minute: startMinute as number,
          });
          let endHour = parseInt(calEntry.endTime.toString().slice(0, 2));
          let endMinute = parseInt(calEntry.endTime.toString().slice(-2));
          this.calEntryForm.controls.endTime.setValue({
            hour: endHour as number,
            minute: endMinute as number,
          });
          this.calEntry = calEntry;
          // add a new id field, when there is an existing id
          this.calEntryForm.addControl(
            '_id',
            this.fb.control('', Validators.required)
          );
          this.calEntryForm.controls['_id'].setValue(calEntry._id);
          // populate with id
        });
    } else {
      this.calEntryFormIsNew = true;
      // default time in timepicker
      this.calEntryForm.controls.startTime.setValue({
        hour: 15,
        minute: 30,
      });
      this.calEntryForm.controls.endTime.setValue({
        hour: 16,
        minute: 30,
      });
    }
  }

  calEntrySubmitted(): void {
    if (this.calEntryForm.invalid) {
      this.formIsInvalid = true;
      return;
    }
    const calEntry = this.calEntryForm.getRawValue();
    // convert object from timpicker into string for backend
    calEntry['startTime'] =
      calEntry['startTime'].hour +
      ':' +
      calEntry['startTime'].minute.toString();
    calEntry['endTime'] =
      calEntry['endTime'].hour + ':' + calEntry['endTime'].minute.toString();
    // two different routes
    // if event exists update
    if (this.route.snapshot.paramMap.get('id')) {
      this.http
        .post<Object>('api/lab-events/update', { calEntry: calEntry })
        .subscribe(resp => {
          this.message = resp['message'];
          const snackBarRef = this.snackBar.open(this.message);
          snackBarRef.afterDismissed().subscribe(() => {
            if (resp['status'] == 'success') {
              this.router.navigate(['/calendar-list']);
            }
          });
        });
    } else {
      // if new event then add
      this.http
        .post<Object>('api/lab-events/add', { calEntry: calEntry })
        .subscribe(resp => {
          this.message = resp['message'];
          const snackBarRef = this.snackBar.open(this.message);
          snackBarRef.afterDismissed().subscribe(() => {
            if (resp['status'] == 'success') {
              this.router.navigate(['/calendar-list']);
            }
          });
        });
    }
  }

  confirmDeletion() {
    const confirm = document.getElementById('Confirm') as HTMLDivElement | null;
    confirm!.style.setProperty('display', 'block');
  }

  deleteCalEntry() {
    this.http
      .post<Object>('api/lab-events/delete', { calEntry: this.calEntry })
      .subscribe(resp => {
        this.message = resp['message'];
        const snackBarRef = this.snackBar.open(this.message);
        snackBarRef.afterDismissed().subscribe(() => {
          if (resp['status'] == 'success') {
            this.router.navigate(['/calendar-list']);
          }
        });
      });
  }

  confirmNo() {
    const confirm = document.getElementById('Confirm') as HTMLDivElement | null;
    confirm!.style.setProperty('display', 'none');
    console.log(confirm);
  }

  goBack(): void {
    window.history.back();
  }
}
