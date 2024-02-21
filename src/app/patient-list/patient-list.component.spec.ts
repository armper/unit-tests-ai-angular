import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Patient } from '../patient/patient';
import { PatientListComponent } from './patient-list.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-patient',
  template: ''
})
class MockPatientComponent {
  @Input() patient: Patient;
  @Output() patientUpdated = new EventEmitter<Patient>();
}

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientListComponent, MockPatientComponent]
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

  it('should update patient when patientUpdated event is emitted', () => {
    const patient: Patient = { name: 'John', details: 'details' };
    const updatedPatient: Patient = { name: 'John', details: 'updated details' };
    component.patients = [patient];
    const patientComponent = fixture.debugElement.query(By.directive(MockPatientComponent));
    patientComponent.triggerEventHandler('patientUpdated', updatedPatient);
    expect(component.patients[0]).toEqual(updatedPatient);
  });
});