import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTickerComponent } from './manage-ticker.component';

describe('FileUploadComponent', () => {
  let component: ManageTickerComponent;
  let fixture: ComponentFixture<ManageTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
