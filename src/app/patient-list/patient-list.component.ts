import { Component, Input } from '@angular/core';
import { Patient } from '../patient/patient';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {

  @Input() patients: Patient[] = [];

  onPatientUpdated($event: Patient): void {
    const index = this.patients.findIndex(patient => patient.name === $event.name);
    this.patients[index] = $event;
  
  }
}
