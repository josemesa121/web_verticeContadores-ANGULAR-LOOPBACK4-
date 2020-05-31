import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionViewComponent } from './view.component';

describe('ObligacionViewComponent', () => {
  let component: ObligacionViewComponent;
  let fixture: ComponentFixture<ObligacionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObligacionViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
