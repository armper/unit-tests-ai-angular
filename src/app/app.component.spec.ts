import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { PatientPageComponent } from './patient-page/patient-page.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientComponent } from './patient/patient.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, PatientPageComponent, PatientListComponent, PatientComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('this-is-the-cool-title');
  });

  it('should render title in a div tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('this-is-the-cool-title');
  });

});