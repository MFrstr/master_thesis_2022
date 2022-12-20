import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/shared/interfaces';
import { AuthService } from '../shared/services';
import { Machine } from '@app/shared/models/machine.model';

import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss'],
})
export class MachineListComponent implements OnInit {
  machines: any = [];
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

    this.getAllMachines();
  }

  getAllMachines(): void {
    this.http.get<Array<Machine>>('api/machines/list').subscribe(machines => {
      this.machines = machines;
    });
  }

  filterMachines(Category: string) {
    let cat = Category;
    console.log(cat);
    this.http
      .post<String>('api/machines/filter', { category: cat })
      .subscribe(machines => {
        this.machines = machines;
        console.log(machines);
      });
  }
}
