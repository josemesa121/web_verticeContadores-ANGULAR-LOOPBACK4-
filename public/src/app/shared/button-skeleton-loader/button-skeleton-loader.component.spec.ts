import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSkeletonLoaderComponent } from './button-skeleton-loader.component';

describe('ButtonSkeletonLoaderComponent', () => {
  let component: ButtonSkeletonLoaderComponent;
  let fixture: ComponentFixture<ButtonSkeletonLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonSkeletonLoaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
