import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixersPage } from './mixers.page';

describe('MixersPage', () => {
  let component: MixersPage;
  let fixture: ComponentFixture<MixersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
