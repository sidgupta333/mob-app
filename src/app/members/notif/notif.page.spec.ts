import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifPage } from './notif.page';

describe('NotifPage', () => {
  let component: NotifPage;
  let fixture: ComponentFixture<NotifPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
