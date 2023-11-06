import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Patient } from './patient';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent {
  @Input() patient!: Patient; 
  @Output() patientUpdated = new EventEmitter<Patient>(); // Emit updated patient data
  isEditMode: boolean = false;

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    this.patientUpdated.emit(this.patient); // Emit the updated patient
    this.toggleEditMode();
  }
}
