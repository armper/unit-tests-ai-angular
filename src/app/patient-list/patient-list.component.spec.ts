import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Patient } from '../patient/patient';
import { PatientListComponent } from './patient-list.component';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientListComponent]
    });
    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update patient when onPatientUpdated is called', () => {
    const patient: Patient = { name: 'John', details: 'details' };
    const updatedPatient: Patient = { name: 'John', details: 'updated details' };
    component.patients = [patient];
    component.onPatientUpdated(updatedPatient);
    expect(component.patients[0]).toEqual(updatedPatient);
  });

  it('should not update patient when onPatientUpdated is called with non-existing patient', () => {
    const patient: Patient = { name: 'John', details: 'details' };
    const updatedPatient: Patient = { name: 'Jane', details: 'updated details' };
    component.patients = [patient];
    component.onPatientUpdated(updatedPatient);
    expect(component.patients[0]).toEqual(patient);
  });
});