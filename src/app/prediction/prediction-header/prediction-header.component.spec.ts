import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionHeaderComponent } from './prediction-header.component';

describe('PortfolioHeaderComponent', () => {
  let component: PredictionHeaderComponent;
  let fixture: ComponentFixture<PredictionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
