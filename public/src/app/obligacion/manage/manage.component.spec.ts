import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionManageComponent } from './manage.component';

describe('ObligacionManageComponent', () => {
  let component: ObligacionManageComponent;
  let fixture: ComponentFixture<ObligacionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObligacionManageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
