import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCustomPage } from './login-custom.page';

describe('LoginCustomPage', () => {
  let component: LoginCustomPage;
  let fixture: ComponentFixture<LoginCustomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCustomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCustomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
