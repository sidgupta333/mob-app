import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerModalComponent } from './mixer-modal.component';

describe('MixerModalComponent', () => {
  let component: MixerModalComponent;
  let fixture: ComponentFixture<MixerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixerModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
