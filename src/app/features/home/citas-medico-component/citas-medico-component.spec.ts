import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasMedicoComponent } from './citas-medico-component';

describe('CitasMedicoComponent', () => {
  let component: CitasMedicoComponent;
  let fixture: ComponentFixture<CitasMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasMedicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitasMedicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
