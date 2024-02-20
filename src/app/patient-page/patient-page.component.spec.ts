import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPageComponent } from './patient-page.component';
import { PatientListComponent } from '../patient-list/patient-list.component';
import { PatientComponent } from '../patient/patient.component';

describe('PatientPageComponent', () => {
  let component: PatientPageComponent;
  let fixture: ComponentFixture<PatientPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientPageComponent, PatientListComponent, PatientComponent]
    });
    fixture = TestBed.createComponent(PatientPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
