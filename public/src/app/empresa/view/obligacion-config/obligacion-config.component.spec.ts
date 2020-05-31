import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaObligacionConfigComponent } from './obligacion-config.component';

describe('EmpresaObligacionConfigComponent', () => {
  let component: EmpresaObligacionConfigComponent;
  let fixture: ComponentFixture<EmpresaObligacionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaObligacionConfigComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaObligacionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
