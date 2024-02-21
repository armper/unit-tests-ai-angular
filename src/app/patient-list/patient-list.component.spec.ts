import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Patient } from '../patient/patient';
import { PatientListComponent } from './patient-list.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-patient-list [patients]="patients" (patientUpdated)="onPatientUpdated($event)"></app-patient-list>`
})
class TestHostComponent {
  patients: Patient[] = [
    { name: 'John', details: 'details1' },
    { name: 'Jane', details: 'details2' }
  ];

  onPatientUpdated(patient: Patient) {
    const index = this.patients.findIndex(p => p.name === patient.name);
    this.patients[index] = patient;
  }
}

describe('PatientListComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientListComponent, TestHostComponent]
    });

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(testHostComponent).toBeTruthy();
  });

  it('should update patient when onPatientUpdated is called', () => {
    const updatedPatient: Patient = { name: 'John', details: 'updated details' };
    testHostComponent.onPatientUpdated(updatedPatient);
    expect(testHostComponent.patients[0]).toEqual(updatedPatient);
  });
});