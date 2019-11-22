import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsPage } from './outlets.page';

describe('OutletsPage', () => {
  let component: OutletsPage;
  let fixture: ComponentFixture<OutletsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
