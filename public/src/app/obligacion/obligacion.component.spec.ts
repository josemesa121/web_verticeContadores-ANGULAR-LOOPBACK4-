import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionComponent } from './obligacion.component';

describe('ObligacionComponent', () => {
  let component: ObligacionComponent;
  let fixture: ComponentFixture<ObligacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObligacionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
