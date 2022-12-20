import { Component, OnInit } from '@angular/core';
import { Machine } from '@app/shared/models/machine.model';

import { AuthService } from '../shared/services';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.scss'],
})
export class MachineFormComponent implements OnInit {
  machine: Machine = new Machine();
  machineId: any;
  message: string = '';
  machineFormIsNew: boolean = false;
  machineCategories: Array<String> = [
    'Fused Layer Modeling (FLM)',
    'Stereolithography (SL)',
    'Laser Sintering (LS)',
    'Laser Cutter',
    'Robot Arm',
    'Cutting Plotter',
    'CNC Mill',
    'Other',
  ];

  formIsInvalid: boolean = false;

  machineForm = this.fb.group({
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required]],
    materialList: this.fb.group({
      materials: this.fb.array([]),
    }),
  });

  get name() {
    return this.machineForm.get('name');
  }
  get category() {
    return this.machineForm.get('category');
  }
  get description() {
    return this.machineForm.get('description');
  }

  // Getter function to return material form array
  get materials(): FormArray {
    return this.machineForm.get(['materialList', 'materials']) as FormArray;
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.populateForm();
    this.machineId = this.route.snapshot.paramMap.get('id');
  }

  populateForm(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      let machineId = this.route.snapshot.paramMap.get('id');
      this.http
        .get<Machine>('api/machines/list?id=' + machineId)
        .subscribe(machine => {
          // console.log(machine);
          this.machineForm.patchValue(machine);
          this.machine = machine;
          // console.log(machine);
          this.machineForm.addControl(
            '_id',
            this.fb.control('', Validators.required)
          );
          this.machineForm.controls['_id'].setValue(machine._id); // populate with id

          // Populate material form fields
          //console.log(machine['materialList']['materials']);
          this.materials.patchValue(machine['materialList']['materials']);
          machine['materialList']['materials'].forEach((material: Object) => {
            this.materials.push(this.fb.group(material));
          });
        });
    } else {
      this.machineFormIsNew = true;
    }
  }

  addMaterial() {
    this.materials.push(
      this.fb.group({
        materialName: [''],
      })
    );
  }

  deleteMaterial(index: number) {
    this.materials.removeAt(index);
  }

  machineSubmitted(): void {
    if (this.machineForm.invalid) {
      this.formIsInvalid = true;
    }
    const machine = this.machineForm.getRawValue();
    //console.log(machine);
    // two routes
    // one for saving new entry
    // one for updating existing one
    if (this.route.snapshot.paramMap.get('id')) {
      this.http
        .post<Object>('api/machines/update', { machine: machine })
        .subscribe(resp => {
          this.message = resp['message'];
          const snackBarRef = this.snackBar.open(this.message);
          snackBarRef.afterDismissed().subscribe(() => {
            if (resp['status'] == 'success') {
              this.router.navigate(['/machine-list']);
            }
          });
        });
    } else {
      this.http
        .post<Object>('/api/machines/add', { machine: machine })
        .subscribe(resp => {
          this.message = resp['message'];
          const snackBarRef = this.snackBar.open(this.message);
          snackBarRef.afterDismissed().subscribe(() => {
            if (resp['status'] == 'success') {
              this.router.navigate(['/machine-list']);
            }
          });
        });
    }
  }

  confirmDeletion() {
    const confirm = document.getElementById('Confirm') as HTMLDivElement | null;
    confirm!.style.setProperty('display', 'block');
  }

  deleteMachine() {
    this.http
      .post<Object>('api/machines/delete', { machine: this.machine })
      .subscribe(resp => {
        this.message = resp['message'];
        const snackBarRef = this.snackBar.open(this.message);
        snackBarRef.afterDismissed().subscribe(() => {
          if (resp['status'] == 'success') {
            this.router.navigate(['/machine-list']);
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
