import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCardsComponent } from './assets-cards.component';

describe('AssetsCardsComponent', () => {
  let component: AssetsCardsComponent;
  let fixture: ComponentFixture<AssetsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
