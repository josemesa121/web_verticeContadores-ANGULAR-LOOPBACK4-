import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaViewObligacionComponent } from './view-obligacion.component';

describe('EmpresaViewObligacionComponent', () => {
  let component: EmpresaViewObligacionComponent;
  let fixture: ComponentFixture<EmpresaViewObligacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaViewObligacionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaViewObligacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
