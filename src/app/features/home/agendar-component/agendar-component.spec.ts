import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarComponent } from './agendar-component';

describe('AgendarComponent', () => {
  let component: AgendarComponent;
  let fixture: ComponentFixture<AgendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
