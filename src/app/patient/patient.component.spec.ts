import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Patient } from './patient';
import { PatientComponent } from './patient.component';
import { FormsModule } from '@angular/forms';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;
    component.patient = new Patient();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle edit mode', () => {
    expect(component.isEditMode).toBeFalse();
    component.toggleEditMode();
    expect(component.isEditMode).toBeTrue();
    component.toggleEditMode();
    expect(component.isEditMode).toBeFalse();
  });

  it('should emit patientUpdated event when saveChanges is called', () => {
    spyOn(component.patientUpdated, 'emit');
    component.saveChanges();
    expect(component.patientUpdated.emit).toHaveBeenCalledWith(component.patient);
  });

  it('should toggle edit mode when saveChanges is called', () => {
    component.isEditMode = true;
    component.saveChanges();
    expect(component.isEditMode).toBeFalse();
  });

  it('should update patient details when saveChanges is called', () => {
    const updatedPatient = { name: 'Updated Name', details: 'Updated Details' };
    component.patient = updatedPatient;
    component.saveChanges();
    expect(component.patient).toEqual(updatedPatient);
  });

  it('should not update patient details when toggleEditMode is called', () => {
    const initialPatient = { name: 'Initial Name', details: 'Initial Details' };
    component.patient = initialPatient;
    component.toggleEditMode();
    expect(component.patient).toEqual(initialPatient);
  });

});