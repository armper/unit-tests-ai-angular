import { Component } from '@angular/core';
import { Patient } from '../patient/patient';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.css']
})
export class PatientPageComponent {
  patients: Patient[] = [];

  constructor() {
    this.patients = [
      { name: 'John Doe', details: 'Detail 1' },
      { name: 'Jane Smith', details: 'Detail 2' }
    ];
  }

}

