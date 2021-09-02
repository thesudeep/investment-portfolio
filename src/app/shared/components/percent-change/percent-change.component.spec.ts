import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentChangeComponent } from './percent-change.component';

describe('PercentChangeComponent', () => {
  let component: PercentChangeComponent;
  let fixture: ComponentFixture<PercentChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});
