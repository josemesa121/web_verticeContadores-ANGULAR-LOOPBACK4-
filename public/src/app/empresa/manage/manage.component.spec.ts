import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaManageComponent } from './manage.component';
import { DocumentoManageComponent } from './manage.component';

describe('EmpresaManageComponent', () => {
  let component: EmpresaManageComponent;
  let fixture: ComponentFixture<EmpresaManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaManageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('DocumentoManageComponent', () => {
  let component: DocumentoManageComponent;
  let fixture: ComponentFixture<DocumentoManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentoManageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
