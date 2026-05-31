import { ComponentFixture, TestBed } from '@angular/core/testing';

import { J6nLogoComponent } from './j6n-logo-component';

describe('J6nLogoComponent', () => {
  let component: J6nLogoComponent;
  let fixture: ComponentFixture<J6nLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [J6nLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(J6nLogoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
